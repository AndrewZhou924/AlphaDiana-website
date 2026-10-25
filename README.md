# AlphaDiana website

This repository contains the public, static website and documentation for
[AlphaDiana](https://alphadiana.org). It does not contain the evaluation runtime,
datasets, run artifacts, credentials, or the dashboard backend.

## Published content

Product wording, quick start and Python API examples follow
[AlphaDiana-dev README at `5721533`](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/5721533be9c1d66a2e37c6dadc99b0c6ce284c90/README.md),
checked on 25 October 2026. `src/data/publication.ts` stores the shared citation; author order follows the arXiv v1 title page, correcting the README's differing position for Menghan Lu. The public `tmlr-group/AlphaDiana` README was
also checked, but still differs; do not mix its old installation/API instructions
with the development examples. Homepage GitHub and setup links name the matching
development repository explicitly.

The public guides were synchronized against the same revision; `docs-sync.json` records source hashes and editorial exceptions. Onboarding follows the finalized README, with OpenCode CLI and Python alternatives. Companion-specific training integration guides are excluded. The older DirectLLM flow remains an explicitly labeled baseline. Dated validation notes describe historical checks, not current acceptance.

The scoreboard and study page retain [arXiv:2610.20675v1](https://arxiv.org/abs/2610.20675v1)
results. All 72 answer-based scores come from Figure 5; interactive results and
measurement limits are in `docs/paper.mdx`. The overview image in `static/img/readme/` is copied unchanged from the finalized README revision. Original published figures and provenance live
in `static/img/paper/`. Do not replace paper scores with local recovery results.

The homepage Dashboard section is removed pending team review. Existing dashboard
reference documentation and assets remain available. Theme/template exploration
is separate from this content update.

## Local development

Use Node.js 20 or newer:

```bash
npm ci
npm run start
```

Before publishing a change, run:

```bash
npm run typecheck
npm run build
```

The production build is written to `build/`.

## Cloudflare Pages

Use these project settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `build` |
| Root directory | `/` |
| Environment variable | `NODE_VERSION=20` |

After the first successful deployment, attach `alphadiana.org` in the Pages
project's Custom domains settings. The response headers in `static/_headers`
are copied into the production build for Cloudflare Pages.

## Publication boundary

Keep this repository limited to the files required to build the public site.
Do not commit `.env` files, API keys, local run outputs, datasets, experiment
artifacts, paper-review material, or backend services. Values shown in command
examples must remain environment-variable placeholders rather than credentials.

## Paper-page layout preview

`/paper-preview` presents the same live homepage content in a research-paper layout, with a centered paper header, author list, compact resource links, section navigation and quieter figure presentation. The shared setup is expandable; both execution interfaces remain accessible. The default homepage and Docs routes remain available for comparison. See [design references](DESIGN-REFERENCES.md) for the template research and rationale.

## Paper content audit

The homepage and paper-facing Docs were checked against arXiv v1 on 25 October 2026. See `PAPER-CONTENT-AUDIT.md` for the checked claims, source locations, citation correction, and separation of paper protocols from runtime presets.
