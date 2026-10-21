# AlphaDiana website

This repository contains the public, static website and documentation for
[AlphaDiana](https://alphadiana.org). It does not contain the evaluation runtime,
datasets, run artifacts, credentials, or the dashboard backend.

## Published content

Product wording, citation, quick start and Python API examples follow
[AlphaDiana-dev README at `613b1368`](https://github.com/AndrewZhou924/AlphaDiana-dev/blob/613b1368d7b4eec6ade909ed88ae88401e1a9fa2/README.md),
checked on 21 October 2026. `src/data/publication.ts` stores the shared citation
verbatim, including author order. The public `tmlr-group/AlphaDiana` README was
also checked, but still differs; do not mix its old installation/API instructions
with the development examples. Homepage GitHub and setup links name the matching
development repository explicitly.

The scoreboard and study page retain [arXiv:2610.20675v1](https://arxiv.org/abs/2610.20675v1)
results. All 72 answer-based scores come from Figure 5; interactive results and
measurement limits are in `docs/paper.mdx`. Original figures and provenance live
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
