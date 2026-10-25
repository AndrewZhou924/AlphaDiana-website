---
sidebar_position: 3
---

# Quick Start

:::note Compatible source revision
These examples follow the finalized [README at `5721533`](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/5721533be9c1d66a2e37c6dadc99b0c6ce284c90/README.md), checked on 25 October 2026. The public mirror still lacks the API factories and example YAML used here. Use the development checkout below; repository access is required.
:::


The examples use **Qwen3.5-27B** as the model and **OpenCode 1.3.2** as the harness. Both the **CLI** and **Python API** run **3 AIME 2026 tasks**, with one sample per task, then analyze the saved results.

You need uv, Python ≥ 3.10, Podman, and an OpenAI-compatible model endpoint.

### 1. Install

Create an isolated Python environment and install the execution and analysis dependencies:

```bash
git clone https://github.com/AndrewZhou924/AlphaDiana-dev.git
cd AlphaDiana-dev
git checkout 5721533be9c1d66a2e37c6dadc99b0c6ce284c90
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

Both workflows use this image, which includes OpenCode **1.3.2** and task tools. [Podman&nbsp;setup&nbsp;guide](/docs/benchmarks/podman)

### 4. Run and analyze with the CLI or Python API

Use `agent`, `data`, `scorer` and optional `env` with either interface. `compute` runs tasks; `analyzer` reads saved artifacts. Exports include tables, PDF/SVG/PNG figures, plotted data, source hashes and evidence coverage.

#### CLI

The CLI uses [`configs/examples/aime2026_opencode.yaml`](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/5721533be9c1d66a2e37c6dadc99b0c6ce284c90/configs/examples/aime2026_opencode.yaml). It matches the Python example's `agent`, `data` and `scorer`, with the endpoint from step 2 and image from step 3.

Validate the config, compute the scored artifacts, then analyze and export them:

```bash
alphadiana validate configs/examples/aime2026_opencode.yaml
alphadiana compute configs/examples/aime2026_opencode.yaml
alphadiana analyzer results/aime_opencode_cli.jsonl --output-dir figures/aime_opencode_cli
```

The run saves scored attempts to `results/aime_opencode_cli.jsonl`.
The analyzer reads those artifacts and exports measurements to `figures/aime_opencode_cli/`.
Check the score, `score_status` and evidence coverage when reading the results.
[Troubleshooting →](/docs/getting-started/troubleshooting)

#### Python API

The Python API composes the same components and passes them to `compute()`.
Run `python` from the repository root in the same terminal, then execute the example below.

![AlphaDiana functional interface: agent, dataset, environment, scorer, runner, and analysis composition.](/img/paper/api.png)

*Functional interface: experiment components and analysis outputs. [Figure sources](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/5721533be9c1d66a2e37c6dadc99b0c6ce284c90/docs/assets/README.md).*

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

ad.analyzer(artifacts).export("figures/aime_opencode_api")
```

`compute()` saves scored attempts in `results/aime_opencode_api.jsonl` and returns artifact references. The export in `figures/aime_opencode_api/` contains the matching tables&nbsp;and&nbsp;figures.

<details>
<summary>Configuration and API details</summary>

Set run controls such as `run_id`, `num_samples` and `task_retries` at the YAML top level or on `ad.runner(...)`. Use `agent`, `data`, `scorer` and optional `env` for components. Legacy `run`, `benchmark` and `sandbox` remain supported. Give each section one name: `data` or `benchmark`; `env`&nbsp;or&nbsp;`sandbox`.

- Use `ad.scorer.create(...)`, an explicit harness `version=`, and `benchmark=` for hub datasets.
- OpenCode manages its own Podman controller.
- For supported harnesses, pass a separate `ad.environment(...)` to `ad.runner(env=...)`.

[Full API guide: compose, reopen, rescore and extend →](/docs/getting-started/python-api)

</details>

### More analysis options

Reopen either workflow's JSONL artifacts without rerunning the agent. Default analysis reads scores, usage counters and native traces. Entropy uses available probability evidence; coverage&nbsp;identifies&nbsp;missing&nbsp;measurements.

<details>
<summary>Reopen, compare and select export formats</summary>

Reopen either run and export SVG figures through the CLI or Python API:

```bash
alphadiana analyzer results/aime_opencode_cli.jsonl \
  --output-dir figures/aime_opencode_cli_reopened --formats svg
```

```python
import alphadiana as ad

ad.analyzer("results/aime_opencode_cli.jsonl").export(
    "figures/aime_opencode_cli_reopened", formats=("svg",),
)
```

Use a new export directory. Omit `--output-dir` to print JSON measurements, matching `ad.analyzer(...).compute()`. Compare runs using multiple CLI paths or a Python list.

</details>

<details>
<summary>Add action and failure labels with an analysis model</summary>

Configure an analysis model that can return structured JSON annotations:

```bash
export ANALYSIS_BASE_URL="https://your-provider.example/v1"
export ANALYSIS_API_KEY="your-api-key"
export ANALYSIS_MODEL="your-analysis-model-id"
```

Annotate either saved run with `--judge` in CLI or `judge=True` in Python:

```bash
alphadiana analyzer results/aime_opencode_cli.jsonl \
  --judge --output-dir figures/aime_opencode_cli_annotated
```

```python
import alphadiana as ad

ad.analyzer(
    "results/aime_opencode_cli.jsonl", judge=True,
).export("figures/aime_opencode_cli_annotated")
```

Use a new export directory. See [annotation requirements and caching](/docs/getting-started/python-api#built-in-measurements).

</details>
