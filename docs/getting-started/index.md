---
sidebar_position: 1
---

# Getting Started

Start with one scored task, then inspect the saved evidence before scaling up.

- [Quick Start](./quick-start): install the execution and analysis dependencies, connect a model endpoint, and run one AIME 2026 task with DirectLLM.
- [Python API and analysis](./python-api): build the OpenCode Podman controller, run three tasks, and export measurements from saved artifacts.
- [Installation](./installation): additional runtime and ROCK setup.
- [Troubleshooting](./troubleshooting): diagnose configuration, provider and runtime failures.

The quick start and API examples follow the [latest development README](https://github.com/AndrewZhou924/AlphaDiana-dev). Its scope table lists supported harnesses, execution environments, measurements and extension points.

## Read results alongside execution status

Check the score, `score_status`, execution status, repeat count and recorded isolation mode. A saved attempt may be incorrect or may have failed during execution or scoring.

`alphadiana report results/` prints a Markdown summary. The Python analyzer exports tables, PDF/SVG/PNG figures, source hashes and evidence coverage. Optional action and failure annotations require a separately configured analysis model; they are not implicit in offline exports.
