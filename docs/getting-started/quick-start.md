---
sidebar_position: 3
---

# Quick Start

This walkthrough follows the [development README at `613b1368`](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/613b1368d7b4eec6ade909ed88ae88401e1a9fa2/README.md), checked on 21 October 2026. Use the repository named in the installation command for the matching CLI and Python API.

**Run:** one AIME 2026 task with DirectLLM.<br />
**Requires:** Qwen3.5-27B endpoint, Python ≥ 3.10.

This example uses a direct model call without a tool loop or task container. It produces one scored attempt and a saved result you can analyze afterward.

### 1. Install

Create an isolated Python environment and install the execution and analysis dependencies:

```bash
git clone https://github.com/AndrewZhou924/AlphaDiana-dev.git
cd AlphaDiana-dev
python -m venv .venv
source .venv/bin/activate
pip install -e '.[analysis,benchmarks,agents]'
```

### 2. Connect your model

Replace the URL and key with your provider's values. The model name must match an ID served by that endpoint.

```bash
export OPENAI_BASE_URL="https://your-provider.example/v1"
export OPENAI_API_KEY="your-api-key"
export OPENAI_MODEL_NAME="Qwen/Qwen3.5-27B"
```

This preset requires streaming, logprobs and `extra_body.chat_template_kwargs.enable_thinking` support.

<details>
<summary>Preset settings / another model</summary>

The preset uses `temperature=0.0`, `top_p=0.95` and a 32768-token output budget. Set `OPENAI_MODEL_NAME` to your endpoint's served model ID. For another endpoint, select or adapt a preset through the [Configuration guide](../configuration/).

</details>

### 3. Validate → run

```bash
alphadiana validate configs/macro_runs/aime2026_directllm_qwen35_27b.yaml \
  -o benchmark.config.max_tasks=1
alphadiana run configs/macro_runs/aime2026_directllm_qwen35_27b.yaml \
  -o run_id=quickstart_aime_directllm_t1_k1 \
  -o benchmark.config.max_tasks=1 \
  -o num_samples=1
```

`validate` checks configuration locally; `run` loads tasks and calls the model endpoint.

The overrides select one task and one sample, then assign a recognizable run ID to the output.

### 4. Read results

```bash
alphadiana report results/
```

**Saved run:** `results/quickstart_aime_directllm_t1_k1.jsonl`<br />
**Check:** score, `score_status` and execution status. [Troubleshooting →](./troubleshooting)

The report summarizes saved attempts. Check status alongside the score to distinguish an incorrect answer from an execution or scoring failure.

## Next steps

The one-task command is a smoke test. For published task counts, sampling and time budgets, see [Paper and published results](../paper). A full reproduction must also match prompts, harness versions, environments and scoring.

Use the [Python API](./python-api) to run OpenCode, reopen saved runs and export tables and figures. OpenCode requires the Podman controller image described there; the DirectLLM quick start above does not.
