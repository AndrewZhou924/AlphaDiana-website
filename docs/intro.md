---
sidebar_position: 1
slug: /intro
---

# Welcome to AlphaDiana

**Measure LLM agents on verifiable reasoning tasks.** Compare scores, inspect trajectories, and test tools, skills and memory.

AlphaDiana runs configured agents against benchmarks, scores their outputs, and saves the evidence needed to analyze each attempt.

## Why AlphaDiana?

A **harness** controls how a model uses prompts, tools and persistent state.

- **Compare agents:** run different model–harness combinations on the same tasks and compare their scores and resource use.
- **Inspect failures:** connect wrong answers to execution status, tool interactions and action patterns in saved trajectories.
- **Test components:** change tools, skills or memory settings and compare outcomes under recorded task and budget settings.

## How it works

1. **Configure:** select tasks, a model and harness, execution environments, a scorer and budgets.
2. **Execute & score:** the runner coordinates task sessions; the native harness runs the agent, and the scorer evaluates its output.
3. **Save evidence:** result records link scores and execution status to retained outputs, traces and resource measurements.
4. **Analyze & export:** reopen those records to compare runs, inspect behavior and produce tables and figures.

Default analysis reads saved scores, usage counters and available probability evidence. Action and failure labels require an explicitly enabled analysis model. Execution and analysis can use separate models.

## Where to start

- [Quick Start](./getting-started/quick-start): one AIME 2026 task with DirectLLM, without a task container.
- [Python API and analysis](./getting-started/python-api): OpenCode on three tasks, plus tables and figure exports.
- [Paper and published results](./paper): experiment scope, metrics and measurement limits.
- [Harnesses](./harnesses/) and [Benchmarks](./benchmarks/): runtime requirements and task guides.
- [Latest README](https://github.com/AndrewZhou924/AlphaDiana-dev): scope, configuration and extension options.

Please also check out [AlphaApollo](https://alphaapollo.org/), our system for deep agentic reasoning ([arXiv](https://arxiv.org/abs/2510.06261), [GitHub](https://github.com/tmlr-group/AlphaApollo)).
