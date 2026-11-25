# Research-page layout references

Reviewed on 25 October 2026. Content follows the finalized AlphaDiana README at `4b245167`; presentation choices do not change paper results, citation, or experiment settings.

| Reference | Useful pattern for Diana | Implementation choice |
| --- | --- | --- |
| [Nerfies](https://nerfies.github.io/) | Centered paper title, author information, compact resource buttons, then a prominent demonstration | Use the published paper title, author order from the shared BibTeX, Paper / Code / Docs links, and Diana's existing positioning figure |
| [Diffusion Policy](https://diffusion-policy.cs.columbia.edu/) | Introduce the idea through a large explanatory figure, then organize evidence into readable sections | Preserve the README's positioning, motivation, scope and workflow order; give original figures more space |
| [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) | Reusable single-paper HTML/CSS sections, figures and BibTeX; derived from Nerfies | Closest template fit for the visual direction. Its source is CC BY-SA 4.0, requiring appropriate attribution if reused |
| [Academic Project Astro Template](https://github.com/RomanHauksson/academic-project-astro-template) | Markdown-authored paper content with figures, tables, code and interactive components | A plausible option for a standalone paper site, but adopting it would also require migrating Diana's existing Docs and build setup |

## Recommended preview

Open `/paper-preview` beside `/`. The preview is an independently implemented Docusaurus layout informed by these references; it does not vendor their HTML/CSS or migrate the site to Astro. Both routes render the same `ResearchHome` content, examples, figures and scoreboard, so future README edits do not need two separate copies.

The preview uses a white background and restrained blue accents. The accent is a CSS variable so the visual system can later be adapted for Apollo in red, with Apollo's own content. No Apollo claims or results are inserted into Diana.

The homepage follows the README: positioning → motivation → scope → quick start → documentation → citation and related project. The existing published-result comparison is retained after documentation. Shared installation steps are expandable on the paper preview; CLI and Python examples remain visible in tabs. The navigation, figure links, code-copy controls and author disclosure are functional.

The current homepage remains the default route. No production deployment or template replacement is implied by this preview.
