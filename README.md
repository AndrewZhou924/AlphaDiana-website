# AlphaDiana website

This repository contains the public, static website and documentation for
[AlphaDiana](https://alphadiana.org). It does not contain the evaluation runtime,
datasets, run artifacts, credentials, or the dashboard backend.

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
