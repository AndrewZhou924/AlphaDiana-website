---
sidebar_position: 3
---

# Quick Start

:::note Version used by these examples

These instructions follow the finalized development README at [`9dd7a7eb`](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/9dd7a7eb9485b49c1d452116cc06f9fee8111b3a/README.md). As checked on 23 October 2026, the public repository has not yet received the API factories and example YAML used here. Use the development checkout below; access to that repository is required.

:::


AlphaDiana provides two ways to run experiments: the **CLI** and the **Python API**.
Both examples below run **OpenCode on 3 AIME 2026 tasks**, with one sample per task, then analyze the saved results.

**Requires:** uv, Python ≥ 3.10, Podman, and an OpenAI-compatible model endpoint.

Complete steps 1–3, then choose the [CLI](/docs/getting-started/quick-start#cli) or [Python API](/docs/getting-started/quick-start#python-api) workflow.

### 1. Install

Create an isolated Python environment and install the execution and analysis dependencies:

```bash
git clone https://github.com/AndrewZhou924/AlphaDiana-dev.git
cd AlphaDiana-dev
git checkout 9dd7a7eb9485b49c1d452116cc06f9fee8111b3a
uv venv --python 3.10 .venv
source .venv/bin/activate
uv pip install -e '.[analysis,benchmarks,agents]'
```

### 2. Set up the model endpoint

Replace the URL and key with your provider's values. The model name must match an ID served by that endpoint.

```bash
export OPENAI_BASE_URL="https://your-provider.example/v1"
export OPENAI_API_KEY="your-api-key"
export OPENAI_MODEL_NAME="Qwen/Qwen3.5-27B"
```

### 3. Build the OpenCode controller image

Run from the repository root with Podman installed:

```bash
podman build \
  -f alphadiana/harness/opencode/deploy/Containerfile.podman-controller \
  -t localhost/alphadiana-opencode-podman:latest \
  alphadiana/harness/opencode/deploy
```

The image contains OpenCode **1.3.2** and task tools. Both examples use this image to run OpenCode. [Podman setup →](/docs/benchmarks/podman)

### CLI

#### Configure and run

The CLI uses [`configs/examples/aime2026_opencode.yaml`](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/9dd7a7eb9485b49c1d452116cc06f9fee8111b3a/configs/examples/aime2026_opencode.yaml). This config reads the endpoint variables from step 2 and selects the controller image built in step 3.

Validate the configuration, then run the experiment:

```bash
alphadiana validate configs/examples/aime2026_opencode.yaml
alphadiana run configs/examples/aime2026_opencode.yaml
```

`validate` checks configuration locally; `run` loads tasks, calls the model endpoint, and saves scored attempts to `results/aime_opencode_cli.jsonl`.

#### Analyze outputs

Print a summary of saved runs:

```bash
alphadiana report results/
```

Check the score, `score_status` and execution status. [Troubleshooting →](/docs/getting-started/troubleshooting)

For token measurements, use the analyzer export below, which also reads native harness traces.

To export measurement tables and figures from this run, execute:

```bash
python - <<'PY'
import alphadiana as ad

ad.analyzer("results/aime_opencode_cli.jsonl").export("figures/aime_opencode_cli")
PY
```

**Exports:** `figures/aime_opencode_cli/` — measurement tables, PDF/SVG/PNG figures, plotted data, source hashes and evidence coverage.

### Python API

The Python API lets you compose the agent, dataset and scorer, then pass them to the runner.

![AlphaDiana functional interface: agent, dataset, environment, scorer, runner, and analysis composition.](/img/paper/api.png)

*The paper's functional interface connects experiment components to analysis outputs. [Figure sources](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/9dd7a7eb9485b49c1d452116cc06f9fee8111b3a/docs/assets/README.md).*

#### Configure and run

Start `python` from the repository root in the same terminal, then run:

```python
import alphadiana as ad

agent = ad.agent(
    "opencode", version="1.3.2", controller_mode="podman",
    controller_image="localhost/alphadiana-opencode-podman:latest",
)
data = ad.dataset("MathArena/aime_2026", benchmark="aime", max_tasks=3)
scorer = ad.scorer.create("numeric")

artifacts = ad.runner(
    run_id="aime_opencode_api", num_samples=1, task_retries=0, strict_report=True,
).compute(agent=agent, data=data, scorer=scorer)
```

`compute()` executes and scores the tasks, then returns references to the saved artifacts in `results/aime_opencode_api.jsonl`.

#### Analyze outputs

Continue in the same Python session:

```python
ad.analyzer(artifacts).export("figures/aime_opencode_api")
```

**Exports:** `figures/aime_opencode_api/` — measurement tables, PDF/SVG/PNG figures, plotted data, source hashes and evidence coverage.

<details>
<summary>API composition details</summary>

Use `ad.scorer.create(...)`, explicit harness `version=`, and `benchmark=` for dataset hub paths. OpenCode owns its Podman controller. Harnesses accepting a separate environment use `ad.environment(...)` and `ad.runner(env=...)`.

[Full API guide: compose, reopen, rescore and extend →](/docs/getting-started/python-api)

</details>

### More analysis options

Both workflows save result JSONL files that you can reopen for analysis. Default analysis reads saved scores, usage counters and available probability evidence. It computes performance, resource use and entropy where the required evidence is present. Coverage records identify the evidence available for each measurement.

<details>
<summary>Reopen a saved run in a new Python session</summary>

Use the saved result path from either workflow and a new export directory:

```python
import alphadiana as ad

ad.analyzer("results/aime_opencode_cli.jsonl").export("figures/aime_opencode_cli_reopened")
```

For the Python API example, use `results/aime_opencode_api.jsonl`.

</details>

<details>
<summary>Add action & failure labels: optional model calls for either workflow</summary>

Configure an analysis model that can return structured JSON annotations:

```bash
export ANALYSIS_BASE_URL="https://your-provider.example/v1"
export ANALYSIS_API_KEY="your-api-key"
export ANALYSIS_MODEL="your-analysis-model-id"
```

Enable `judge=True` when reopening a saved run. Use the result path from either workflow:

```python
import alphadiana as ad

ad.analyzer(
    "results/aime_opencode_cli.jsonl", judge=True
).export("figures/aime_opencode_cli_annotated")
```

[Measurement requirements and annotation caching →](/docs/getting-started/python-api#built-in-measurements)

</details>
