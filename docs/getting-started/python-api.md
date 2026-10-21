---
sidebar_position: 4
title: Python API and analysis
---

# Python API and analysis

These examples follow the [development README at `613b1368`](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/613b1368d7b4eec6ade909ed88ae88401e1a9fa2/README.md), checked on 21 October 2026. Install that repository using the [quick start](./quick-start). It exports `ad.agent`, `ad.dataset`, `ad.runner`, and `ad.analyzer`; older releases may differ.

## Run OpenCode on three AIME tasks

**OpenCode → 3 AIME tasks → scores, traces and figures.** Use the endpoint variables in the [quick start](./quick-start).

The Python API lets you select the agent, dataset and scorer separately, then pass them to the runner. This example runs OpenCode inside the Podman controller built below.

<details>
<summary><strong>Setup required:</strong> build the OpenCode controller image with Podman</summary>

Run from the repository root with Podman installed:

```bash
podman build \
  -f alphadiana/harness/opencode/deploy/Containerfile.podman-controller \
  -t localhost/alphadiana-opencode-podman:latest \
  alphadiana/harness/opencode/deploy
```

The image contains OpenCode **1.3.2** and task tools. Its tag must match `controller_image` below. [Podman setup →](../benchmarks/podman)

</details>

```python
import alphadiana as ad

agent = ad.agent(
    "opencode", version="1.3.2", controller_mode="podman",
    controller_image="localhost/alphadiana-opencode-podman:latest",
)
data = ad.dataset("MathArena/aime_2026", benchmark="aime", max_tasks=3)
scorer = ad.scorer.create("numeric")

artifacts = ad.runner(run_id="aime_opencode_demo").compute(
    agent=agent, data=data, scorer=scorer,
)

ad.analyzer(artifacts).export("figures/aime_opencode_demo")
```

**Results:** `results/`<br />
**Exports:** tables + PDF/SVG/PNG.

`compute()` executes and scores the tasks, then returns references to the saved artifacts. `ad.analyzer(artifacts).export(...)` reads those artifacts and generates measurement tables and figures.

![AlphaDiana functional interface: agent, dataset, environment, scorer, runner, and analysis composition.](/img/paper/api.png)

*The paper's functional interface connects experiment components to analysis outputs. [Figure source](https://arxiv.org/abs/2610.20675v1).*

<details>
<summary>API composition details</summary>

Use the current API shown above: `ad.scorer.create(...)`, explicit harness `version=`, and `benchmark=` for dataset hub paths. OpenCode owns its Podman controller. Harnesses accepting a separate environment use `ad.environment(...)` and `ad.runner(env=...)`.

[Full API guide: compose, reopen, rescore and extend →](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/613b1368d7b4eec6ade909ed88ae88401e1a9fa2/docs/getting-started/python-api.md)

</details>

## Analysis and outputs

**Already have a saved run? Export measurements without rerunning the agent.**

Default analysis reads saved scores, usage counters and available probability evidence. It computes performance, resource use and entropy where the required evidence is present.

```python
import alphadiana as ad

ad.analyzer("results/quickstart_aime_directllm_t1_k1.jsonl").export(
    "figures/quickstart_aime"
)
```

**Outputs:** tables, figures, plotted data, source hashes and evidence coverage.

Coverage records show which measurements have supporting evidence. For example, a run can report accuracy and output tokens even when logprobs are unavailable for entropy.

**Need action or failure labels?** Enable the optional analysis model below to annotate saved trajectories.

<details>
<summary>Add action & failure labels: optional model calls</summary>

Configure the analysis model, then enable `judge=True`:

```bash
export ANALYSIS_BASE_URL="https://your-provider.example/v1"
export ANALYSIS_API_KEY="your-api-key"
export ANALYSIS_MODEL="your-analysis-model-id"
```

```python
ad.analyzer(
    "results/quickstart_aime_directllm_t1_k1.jsonl", judge=True
).export("figures/quickstart_aime_annotated")
```

[Measurement requirements and annotation caching →](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/613b1368d7b4eec6ade909ed88ae88401e1a9fa2/docs/getting-started/python-api.md#built-in-measurements)

</details>
