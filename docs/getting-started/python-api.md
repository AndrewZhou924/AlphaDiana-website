---
sidebar_position: 4
title: API concepts and version availability
---

# API concepts and version availability

Figure 4 of the [AlphaDiana paper](https://arxiv.org/abs/2610.20675v1) presents a modular interface for composing evaluations and analyzing saved artifacts. The harness remains responsible for its native execution loop.

![Original paper Figure 4: AlphaDiana measurement interfaces](/img/paper/api.png)

The figure is reproduced from the paper, including its schematic calls and illustrative measurements. It is not a copy-and-run example for every released code version.

## Check your code version

The public [AlphaDiana source snapshot `7e39c1e`](https://github.com/tmlr-group/AlphaDiana/tree/7e39c1eca4a30fbc27e33314cec2cbcdc51ded90), checked on 17 October 2026, provides the CLI and component classes but does **not** export the top-level `ad.agent`, `ad.dataset`, `ad.runner`, and `ad.analyzer` factories shown in the paper. Installing that snapshot does not make the figure's Python snippet executable.

For this public snapshot, follow the [CLI quick start](./quick-start) to configure and run a harness, then use `alphadiana report` or the [dashboard](../dashboard) to inspect saved results. When using a newer release, check its API documentation and exported signatures before copying a Python example.

## Interface responsibilities

| Paper interface | Responsibility |
| --- | --- |
| Dataset | Select tasks and map their inputs and scoring references to a common task representation. |
| Agent | Configure the model and native harness; preserve its control loop and tools. |
| Environment | Provide task execution and session state with explicit reuse boundaries. |
| Scorer | Judge the final answer or task artifact against the benchmark contract. |
| Runner | Allocate sessions, dispatch tasks, collect outcomes, and persist evidence. |
| Analyzer | Compare correctness, execution status, trajectories, and resource measurements from saved artifacts. |

Scoring references belong to the scorer, not the model prompt. A completed run may contain wrong answers, timeouts, or other execution failures. Analysis must retain those outcomes and identify missing evidence rather than presenting every saved record as a successful execution.
