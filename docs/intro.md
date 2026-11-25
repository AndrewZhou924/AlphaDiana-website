---
sidebar_position: 1
slug: /intro
---

# AlphaDiana: A Measurement System for Agents in Verifiable Reasoning Tasks

[**Paper**](https://arxiv.org/abs/2610.20675) — More experiments and analysis of agent behavior, components and resource use.

Compare scores and traces on verifiable reasoning tasks. Test tools, skills and memory.

AlphaDiana runs agents on benchmarks, scores their answers and saves execution evidence for later analysis.


## How it works


1. **Configure:** select tasks, a model and harness, execution environments, a scorer and budgets.
2. **Execute & score:** the runner coordinates task sessions; the native harness runs the agent, and the scorer evaluates its output.
3. **Save evidence:** result records link scores and execution status to retained outputs, traces and resource measurements.
4. **Analyze & export:** reopen those records to compare runs, inspect behavior and produce tables and figures.


## Start here

- [Quick Start](/docs/getting-started/quick-start): OpenCode on three AIME tasks through CLI or Python.
- [Python API and analysis](/docs/getting-started/python-api): compose, reopen, rescore and export.
- [Harnesses](/docs/harnesses/) and [benchmarks](/docs/benchmarks/): supported runtime paths.
- [Published paper results](/docs/paper): the paper protocol and its measurement limits.
