# AlphaDiana website

This repository contains the public, static website and documentation for
[AlphaDiana](https://alphadiana.org). It does not contain the evaluation runtime,
datasets, run artifacts, credentials, or the dashboard backend.

## Published content

The homepage and study page follow [arXiv:2610.20675v1](https://arxiv.org/abs/2610.20675v1),
published 14 October 2026. Publication metadata and BibTeX live in
`src/data/publication.ts`. The scoreboard transcribes all 72 answer-based scores
from Figure 5 and computes deltas from the displayed values; interactive results
and measurement limits are documented in `docs/paper.mdx`.

Original paper figures and provenance are in `static/img/paper/`. Do not replace
published scores with local smoke-test or selectively retried results. Dashboard
screenshots and Figure 4 contain illustrative runs, not additional scoreboard data.

The `clean-website` branch of the development repository was consulted for the
documentation layout. Its Python API instructions target a development revision;
the public code snapshot does not export those factories yet. The API page makes
that version boundary explicit and directs public-code users to the CLI guide.

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
