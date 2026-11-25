---
sidebar_position: 3
---

# Evaluation Axes: Tools, Skills, and Memory

AlphaDiana compares complete harness conditions that change tool exposure,
skill loading, or memory behavior. Changes may affect both instructions and
runtime state, so a comparison does not necessarily isolate one mechanism.

## Published study coverage

The paper reports all three axes in [Section 4 and Appendix D](https://arxiv.org/pdf/2610.20675v1#page=8).
Its macro baseline is Default Harness with native prompts and tools, without
added skill libraries or instructions to use memory.

| Axis | Published comparisons | Source |
| --- | --- | --- |
| Tool | ZeroClaw and OpenCode; Qwen3.5-27B and Kimi-K2.6; GPQA-Diamond and AIME 26; default versus tool-registry removal | Figure 10, Appendix D.2 |
| Skill | The same model/harness/task combinations; default versus Math or General libraries | Figures 11–12, Appendix D.3 |
| Memory | OpenClaw, OpenCode, and ZeroClaw; Qwen3.5-27B on AIME 26; three persistence scopes | Figures 13–14, Appendix D.4 |

OpenClaw participates in the memory study, but not the tool/skill intervention
matrix. Keep model, tasks, scoring, decoding, budgets, and the native agent loop
matched within each comparison, and record all changed prompts and settings.

Direct is the no-tool, single-response reference for answer-based tasks. A score
gap against Direct describes a complete model–harness–task configuration; it
does not by itself identify the cause. See [Paper and published results](/docs/paper)
for scores and resource-accounting limits.

## What each intervention changes

| Axis | Intervention | Reference condition |
| --- | --- | --- |
| Tool | Suppress model-visible tool descriptions and related instructions, preserving the native harness loop | Default native tools and prompts |
| Skill | Mount a Math or General library through the native interface and add loading instructions; native tools remain available | No added skill library |
| Memory | Retain designated memory at the chosen scope and add memory-use instructions | Clear memory between attempts without explicitly eliciting its use |

Tool removal is not the same condition as changing memory retention. Default
Harness still has native tools, and native memory availability is distinct from
whether its use is elicited or its state survives an attempt. Skill loading is
also a full configuration: OpenCode uses the same instruction wording for both
libraries, whereas ZeroClaw requires Math loading and makes General optional.

Runnable presets live under
[`configs/micro_runs/`](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/5721533be9c1d66a2e37c6dadc99b0c6ce284c90/configs/micro_runs/README.md).
Check each preset against the published condition; a directory name or config's
presence does not establish that it reproduces a published run.

## Published memory conditions

The paper keeps model weights fixed and resets raw interaction histories and
workspace files between attempts. Only designated memory persists, without a
separate answer cache.

| Paper scope | State boundary |
| --- | --- |
| Cross-Rollout | Four attempts on one problem share writable memory; clear it before the next problem |
| Cross-Task | Each of four separate runs processes Tasks 1–30 sequentially, starting with empty memory and retaining it across tasks; no sharing between runs |
| Cross-Dataset | Build memory on AIME 25, freeze it before AIME 26, and read it without updates on target tasks |

In Figure 13, all three scopes improve OpenCode and reduce OpenClaw and
ZeroClaw accuracy relative to Default Harness; all nine configurations remain
below Direct. Figure 14 reports memory accumulation, including separate
sequential runs whose defaults can differ from Figure 13.

OpenCode includes earlier solutions in later prompts. OpenClaw and ZeroClaw
retrieve stored summaries. The experiment changes both memory instructions and
persistence, while retrieval, prompt length, and control loops differ across
harnesses. It therefore does not establish that anchoring, noise, or any one
storage mechanism causes the score differences.

Cross-Rollout attempts are dependent because later attempts may reuse earlier
solutions. Cross-Task running accuracy also varies with the difficulty of tasks
seen so far. Do not interpret these as independent repeated samples or a general
guarantee that more memory improves accuracy.

## Runtime memory controls

Runtime configuration keys and paper condition names are not interchangeable.
The following controls describe the release interface; reproducing a paper
condition also requires the matching task order, reset policy, prompts, and
artifacts.

| Runtime scope | Intended boundary | Relation to the paper |
| --- | --- | --- |
| `intra_task` | Fresh state for each `(task, sample)` | Does not retain state across attempts; not a fourth published memory condition |
| `cross_sample` | Retain memory across attempts on one task; reset at the task boundary | Persistence boundary used by Cross-Rollout, with its other settings also required |
| `cross_task` | Retain memory across tasks in a sequential run | Persistence boundary used by Cross-Task, with separate runs and fixed order required |

Cross-Dataset instead requires a build/freeze protocol. A retention scope alone
does not establish that the source memory came from AIME 25 or stayed frozen.

### Mechanisms and evidence

The runner controls reuse boundaries while each harness implements its native
storage and retrieval path. The [OpenCode](/docs/harnesses/opencode),
[OpenClaw](/docs/harnesses/openclaw), and [ZeroClaw](/docs/harnesses/zeroclaw)
guides document those paths. Native evidence is needed to establish what a run
actually retained or retrieved; benchmark scores alone do not establish that.

### Configuration

Memory is enabled per harness through `agent.config`. The master switch is the
same across all three harnesses; the remaining keys are harness-specific.

| Key | Harness | Purpose |
|---|---|---|
| `memory_scope` | all three | `intra_task`, `cross_sample`, or `cross_task`; stateful scopes are sequential |
| `persistent_memory` | all three | Retain native memory across work items |
| `memory_enabled` | all three | Enable native memory even when the store is isolated to one work item |
| `strict_memory` | all three | Require verifiable native memory execution; no silent fallback |
| `compact_after_task` | OpenCode | Run `/compact` after each task |
| `fresh_session` | OpenCode | Fresh session per task; fills and injects the harness memory bank instead of chaining sessions |
| `memory_freeze` | OpenCode | Transfer mode: frozen tasks fork from a post-build HOME snapshot |
| `oracle_feedback` | all three | Optional post-solve reflection exposing `ground_truth`; this is a separate experimental condition, not an instruction to enable it for the published memory protocol |
| `context_limit` / `output_limit` | OpenCode | Declare token budget so OpenCode's native autocompact fires before the provider's hard wall |
| `memory_embedding.{base_url, model, dimensions, search_mode}` | ZeroClaw | Vector recall; omit `base_url` to fall back to FTS-only |
| `memory_lancedb.{api_key, model, base_url, dimensions, db_path, auto_capture, auto_recall}` | OpenClaw | Flat keys in one dict: embedding endpoint (api_key, model, base_url, dimensions) and the LanceDB store path. `auto_capture` / `auto_recall` are read on the gateway path only; the local-agent path hardcodes `autoCapture: false` and `autoRecall: true` |

OpenCode's flags are parsed by `OpenCodeAgent.setup()` in
`alphadiana/harness/opencode/agent.py`. ZeroClaw's memory store-turn is
`_memory_store_via_agent` in `alphadiana/harness/zeroclaw/agent.py`, which skips the write when a task
carries `metadata['memory_mode'] == 'frozen'`. OpenClaw runs memory through an
embedded `openclaw agent --local` two-turn flow
(`alphadiana/harness/openclaw/agent.py`) so the `memory-lancedb` plugin's
`autoRecall` / `autoCapture` hooks fire; the chat/completions path never
triggers them.

The separate transfer protocol is data-driven: each task carries `metadata.memory_mode`, either
`build` (write + recall) or `frozen` (recall only). The default is `build`.

### Running a memory experiment

This example runs a framework preset; it does not by itself reproduce the full paper protocol.

```bash
python -m alphadiana.cli run \
  configs/micro_runs/Memory/cross_task/aime2026_zeroclaw_qwen35_27b.yaml \
  --redo-all
```

The ZeroClaw Cross-Task reference uses sqlite FTS mode (no embedding endpoint
needed). It reads provider and ROCK environment variables including `OPENAI_MODEL_NAME`,
`OPENAI_BASE_URL`, `OPENAI_API_KEY`, `ROCK_BASE_URL`, and `ROCK_PROXY_URL`. An
unset one is blanked rather than reported. The three `OPENAI_*` are named back to
you when the run dies, but an unset `ROCK_*` fails opaquely: the runner quietly
falls back to a default localhost ROCK port and you get a connection error.

The config also pins `rock_image: zeroclaw-reasoning:0.6.9`, which makes the
runner auto-create a ROCK sandbox, so the ROCK mode prerequisites on the
[ZeroClaw](/docs/harnesses/zeroclaw) page apply first: build that image locally (it
is not published on Docker Hub), then start the host ROCK services with
`bash scripts/setup/start_zeroclaw.sh` and export their URLs with
`source scripts/rock_env.sh`. Both scripts need the `ref/ROCK` checkout that the
one-time setup in [Installation](/docs/getting-started/installation) creates, and
abort without it, which is what leaves the two `ROCK_*` variables unset.

Cross-Sample is not just `num_samples > 1`: `memory_scope: cross_sample` also
enforces sequential dispatch and explicitly rebuilds harness/sandbox state at
the task boundary. With `strict_memory: true`, ZeroClaw verifies that the native
entry count increased and OpenClaw verifies a new LanceDB transaction before a
work item is accepted.

Cross-Sample and Cross-Task samples are deliberately dependent observations.
The generated report therefore labels their aggregates `Sequential Any@k` and
`Sequential Mean@k`; they must not be interpreted as standard independent
pass@k estimates.

### Reading the results

Memory results land through the result store at
`alphadiana/results/store.py`; the run loop lives under
`alphadiana/engine/` (`alphadiana/engine/runner.py`). The plots and the scope
ladder are regenerated from the recorded results.

Report the configured sample count, run IDs, and uncertainty with every result.
Do not infer precision or robustness from an intended design when the matching
artifacts are not present in the checkout.
