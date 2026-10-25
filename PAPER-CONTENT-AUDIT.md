# Paper content audit — 25 October 2026

Source: [AlphaDiana, arXiv:2610.20675v1](https://arxiv.org/abs/2610.20675v1), submitted 14 October 2026, 57 pages.
PDF SHA-256: `47e093550b202580ea08af47dc85adce94277cbddfee87e96ffdd53ee865baf3`.

The review covers the original homepage, scoreboard, publication metadata, paper
guide, and paper-facing claims in the concepts/configuration guides. Runtime
implementation instructions remain versioned documentation; this review does
not claim a new execution acceptance test or a reproduction of the experiments.

| Claim or content | Paper evidence | Review outcome |
| --- | --- | --- |
| Title, date and author order | Title page and arXiv metadata | Corrected Menghan Lu's position to follow Shiyang Liu; the pinned development README has a different order |
| Homepage scores | Figure 5, p. 6 | All 72 values match; unchanged |
| Docs interactive scores | Figure 5, p. 6 | All 16 values match; unchanged |
| Models, harness versions and task-native references | Section 3, Appendix B.1, Table 5 | Retained the three-model answer-based study and two-model interactive study; baseline differs by task type |
| Sampling and limits | Appendix B.1 and C.5 | AIME 30 tasks × 4 attempts, other macro tasks Avg@1, top-p 0.95, per-call output 131072; controller/request 9300 s and OpenClaw stream total 9000 s |
| Tool/skill coverage | Section 4, Figures 10–12, Appendix D.2–D.3 | Replaced stale table references; distinguished complete prompt/loading conditions from isolated mechanisms |
| Memory coverage and results | Figures 13–14, Appendix D.4 | Removed all claims that memory is outside the paper; documented Cross-Rollout, Cross-Task and frozen Cross-Dataset conditions |
| Memory interpretation | Section 4 and Appendix D.4 | Removed unsupported anchoring/noise/monotonicity explanations; memory instructions and persistence change together, and cross-harness causes are not isolated |
| Runtime scopes | Appendix D.4 versus runtime configuration guide | Kept runtime `intra_task` / `cross_sample` / `cross_task` names distinct from paper conditions; Cross-Dataset needs a separate build/freeze protocol |
| Resources and process analysis | Section 3, Appendix B.2 and C.5 | Clarified top-K entropy, pooled action shares, token coverage, cohort differences and tokens-per-correct accounting; not a monetary cost or isolated latency claim |
| API illustration | Figure 4 versus README Quick Start | Added a caption distinguishing schematic paper calls and illustrative numbers from executable onboarding commands |
| Quick Start and local recovery | README example versus Appendix B.1 | Three-task onboarding and targeted recovery results are not the published experiment matrix |

The layout and original figures are preserved. The original homepage remains
the default; `/paper-preview` remains an alternative for review. No model runs,
production merge, or production deployment are part of this content update.
