---
sidebar_position: 2
---

# Harness-Aware Evaluation

Reasoning performance in agent systems depends on more than the base model
alone. It is also shaped by the **agent framework, tool interface, execution
environment, and evaluation protocol**. Run the *same* model through two
different agent scaffolds and you will routinely see very different accuracy.
The scaffold is a measurement instrument, and a leaderboard number that does not
name its harness is under-specified.

AlphaDiana treats the **harness as a first-class, swappable variable**. The
benchmark, the model endpoint, and the scaffold are decoupled, so you can hold
any two fixed and vary the third. This page explains that decoupling, the
`direct_llm` reference baseline, the "agent scaffold tax," and the macro/micro
study split.

## Decoupling model from harness

A run is the product of three independent choices:

- the **benchmark** (e.g. AIME, GPQA, HLE) under `benchmark` in the config,
- the **model endpoint** (an OpenAI-compatible base URL + model name),
- the **harness** (an `Agent`) selected by `agent.name`.

The endpoint is a logical evaluation input, but its config key is not uniform
across transports. `direct_llm`, OpenCode, and ZeroClaw use `api_base` as the
provider endpoint. OpenClaw uses lowercase `api_base` for an already-running
**agent gateway**; its runtime provider endpoint is configured separately as
`OPENAI_BASE_URL` / `openai_base_url` inside `agent.config`. See
[Provider endpoints and agent gateways](/docs/getting-started/installation#provider-endpoints-and-agent-gateways).

Every harness implements the same contract: the `Agent` abstract base class in
[`alphadiana/harness/base.py`](/docs/architecture/). It defines
`setup(config: dict)`, `solve(task: BenchmarkTask, sandbox=None) -> AgentResponse`,
and a no-op `teardown()`, plus class attributes `name` and `version`. The engine
sets `agent.version`, then calls `setup()` once and `solve()` per task
(`alphadiana/engine/runner.py`). The uniform response contract makes comparison
possible, but swapping harnesses is not generally a one-line edit: endpoint
keys, controller/sandbox runtime, prompts, retries, and timeout controls can
differ. Report and match those fields before associating an accuracy gap with a
harness condition.

Every harness returns the same shape, the `AgentResponse` dataclass
(`AgentResponse` in `alphadiana/harness/base.py`). Beyond the core fields (`answer`, `trajectory`, `raw_output`,
`token_usage`, `token_entropy_stats`, `wall_time_sec`, `metadata`) it carries
extended observability fields such as `reasoning_trajectory`, `request_messages`,
`response_json`, `system_prompt`, `finish_reason`, and `artifact_manifest`, so
two harnesses are compared on an identical record schema. Raw harness runtime
artifacts are normalized into these fields by
`alphadiana/harness/proxies/preservation.py`, and the result store at
[`alphadiana/results/store.py`](/docs/architecture/) writes them
to disk.

### The registry

Harnesses are looked up by string key through `AgentRegistry`
(`alphadiana/harness/registry.py`), a classmethod-only singleton over a
class-level `_registry: dict[str, Type[Agent]]`. The keys are the values you put
in `agent.name`:

| `agent.name` | Harness | Scaffold |
| --- | --- | --- |
| `direct_llm` | [Direct LLM](/docs/concepts/#the-baseline-direct_llm) | none (single-turn chat) |
| `opencode` | [OpenCode](/docs/harnesses/opencode) | `opencode` CLI, multi-turn + tools |
| `openclaw` | [OpenClaw](/docs/harnesses/openclaw) | OpenClaw gateway + ROCK sandbox |
| `zeroclaw` | [ZeroClaw](/docs/harnesses/zeroclaw) | ZeroClaw agent loop |

`AgentRegistry.list()` returns the sorted available names; `AgentRegistry.get(name)`
raises `KeyError` (with the available names embedded in the message) on a miss.
Registration is **import-triggered, not auto-discovered**: `runner.py` explicitly
imports each agent module so the module-level `AgentRegistry.register(...)` call
at the bottom of the file fires. Adding a new harness therefore means both adding
the `register()` call *and* an import line in the runner.

## The direct_llm baseline

`DirectLLMAgent` (`alphadiana/harness/direct_llm/agent.py`, `name = "direct_llm"`) is
the **no-harness reference**: a single-turn system+user chat to an
OpenAI-compatible endpoint with **no tools, no multi-turn loop, and no code
execution**. It is a reference rather than an accuracy floor, useful for
establishing a clean baseline before measuring the effect of an agent framework.

It deliberately builds its own client with `httpx.Client(trust_env=False)` so
inherited SOCKS/HTTP proxy environment variables cannot break it. The default
system prompt asks the model for a `\boxed{}` answer, and `_extract_answer`
prefers the boxed value. Reasoning is recovered from `reasoning_content` /
`reasoning` model-extra fields and from `<think>...</think>` tags.

By default `direct_llm` also captures logprobs (`capture_logprobs=True`) and
quantizes them to `int16`, so token-entropy analysis is available when the endpoint returns usable probability evidence. Capture coverage must still be checked.

### Config

Config keys are resolved from `agent.config`, with environment fallbacks for the
three connection fields (`OPENAI_MODEL_NAME`, `OPENAI_BASE_URL`,
`OPENAI_API_KEY`).

| Key | Default | Notes |
| --- | --- | --- |
| `model` | `OPENAI_MODEL_NAME` | model name on the endpoint |
| `api_base` | `OPENAI_BASE_URL` | OpenAI-compatible base URL |
| `api_key` | `OPENAI_API_KEY` / `EMPTY` | use `sk-EMPTY`, not the literal `EMPTY` |
| `temperature` | `0.7` | |
| `top_p` | — | |
| `max_tokens` | auto | if unset, GETs `{api_base}/models`, uses `max_model_len - 8192` (fallback `131072`) |
| `request_timeout` | `600` | per-request seconds |
| `stream` | `True` | |
| `stream_total_timeout` | defaults to `request_timeout` (600 seconds); `0`/`None` disables | on hit, `answer=None`, `finish_reason="timeout"` |
| `max_retries` | `3` | exponential backoff with jitter |
| `system_prompt` | boxed-answer prompt | |
| `enable_thinking` | — | |
| `extra_body` | — | passthrough to the request body |
| `capture_logprobs` | `True` | |
| `top_logprobs` | `20` | |
| `logprobs_format` | `int16` | `int16` or `float` |

> [!WARNING]
> For local vLLM, use any non-`EMPTY` string such as `sk-EMPTY`. The literal
> `"EMPTY"` (case-insensitive) is treated as unset and falls back to the
> environment.


```yaml
# configs/macro_runs/gpqa_directllm_qwen35_27b.yaml (excerpt)
agent:
  name: direct_llm
  config:
    api_key: sk-EMPTY
    temperature: 0.6
    capture_logprobs: true
```

```bash
python -m alphadiana.cli validate configs/macro_runs/aime2026_directllm_qwen35_27b.yaml
python -m alphadiana.cli run configs/macro_runs/aime2026_directllm_qwen35_27b.yaml \
  -o run_id=concept_aime_directllm_t1_k1 \
  -o benchmark.config.max_tasks=1 -o num_samples=1
```

## The agent scaffold tax

A harness may improve or reduce accuracy relative to the matched `direct_llm`
baseline. The paper reports effects that vary by model and task; it does not
establish a universal penalty or identify one runtime mechanism as the cause.
Read the signed gap:

```text
harness_accuracy − direct_llm_accuracy
```

A negative gap is sometimes called an "agent scaffold tax". It is a descriptive
accuracy difference for that configuration, not a monetary charge or a causal
estimate of harness overhead. Compare resource use separately, with its coverage
and timing limitations.

## Macro and micro studies

AlphaDiana supports two complementary modes of harness-aware study:

- **Macro** — compare whole harness conditions (`direct_llm` vs `opencode` vs
  `openclaw` vs `zeroclaw`) on a fixed model and benchmark, then compare
  end-to-end accuracy, recorded output-token use, and elapsed time. The harness-specific runtime and transport
  fields are part of each condition; keep shared budgets fixed and disclose the
  fields that cannot be identical.

- **Micro** — compare a matched scaffold intervention (tool exposure, skill
  loading, memory behavior, and any associated prompt changes) against its
  baseline condition. Tool filtering uses request-stream controls; skill and memory conditions also require native loading, storage, and reuse policies. The
  [Tool / Skill / Memory axes](/docs/concepts/evaluation-axes) page covers the ablation
  design.

### Proxies for micro intervention

Two distinct proxies live under `alphadiana/harness/proxies/`, with opposite
lifecycles. They are not wired together.

- **`LogprobCaptureProxy`** (`logprob_proxy.py`) is an *in-process* threaded HTTP
  proxy that the harness agents spin up so the in-sandbox CLI agent's
  OpenAI-bound traffic is routed through it. It injects `logprobs=True` /
  `top_logprobs`, can normalize messages, and captures request/response summaries
  for observability. This is the mechanism that gives the agent harnesses the
  same logprob data `direct_llm` gets directly.

- **`tool_filter_proxy.py`** is a *standalone* aiohttp CLI proxy (not imported by
  any agent) for experimental intervention on the request stream. It mutates
  `POST /v1/chat/completions` to filter tools by name (`--allow` / `--block`
  regex), strip or replace the system prompt (`--harness-strip` is section-aware
  per harness via `harness_strip.py`, used for the "no-tools" micro-cell), strip
  AlphaDiana's prepended user-intro block, and apply OpenRouter provider /
  reasoning overrides.

```bash
python -m alphadiana.harness.proxies.tool_filter_proxy \
  --port 9100 --upstream http://127.0.0.1:8000/v1 --api-key sk-EMPTY \
  --harness-strip zeroclaw
```

> [!NOTE]
> Unlike `direct_llm` (which forces `trust_env=False`), `tool_filter_proxy` uses
> `trust_env=True` so it honors `HTTP(S)_PROXY` to reach upstreams on locked-down
> hosts.


## Skills

A related, prompt-level lever is **skills**: file bundles under
`alphadiana/harness/skills/<name>/`, each with a top-level `SKILL.md` (YAML
frontmatter with `name` + `description`). Shipped bundles include
`advanced-maths` (a symbolic/numeric protocol) and `anthropic-bundle`.

Select one with `agent.config.skill_folder`, which accepts three forms: an empty
value disables it; an absolute path is used as-is; a bare name resolves to
`alphadiana/harness/skills/<name>/`.

| Harness | How the bundle is mounted |
| --- | --- |
| `opencode` | `shutil.copytree` into `<workdir>/skills/<name>` so the `read` tool can index it |
| `zeroclaw` | `sandbox.upload()` of each file into `<workspace_dir>/skills/<name>/` |

> [!WARNING]
> Skills are **not auto-injected** into context. The system prompt must instruct
> the model to read the mounted `SKILL.md`. Skill efficacy is therefore a
> prompt-level concern, which makes it a clean micro axis to ablate.


## See also

- [Tool / Skill / Memory axes](/docs/concepts/evaluation-axes) — the micro ablation design.
- [Direct LLM, OpenCode, OpenClaw, ZeroClaw](/docs/harnesses/) — per-harness reference pages.
- [Benchmark isolation](/docs/concepts/isolation-and-fairness) — keeping comparisons fair across harnesses.
