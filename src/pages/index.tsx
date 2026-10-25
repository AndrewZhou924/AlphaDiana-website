import { paperTitle, paperUrl, paperBibtex, productTagline, codeUrl } from '@site/src/data/publication';
import Hero from '@site/src/components/Hero';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import InstallBox from '@site/src/components/InstallBox';
import Scoreboard from '@site/src/components/Scoreboard';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import React, { ReactNode } from 'react';
import styles from './index.module.css';

const installCommand = "git clone https://github.com/AndrewZhou924/AlphaDiana-dev.git\ncd AlphaDiana-dev\ngit checkout 4b24516701706628cbe202c842d3928f566c3f69\nuv venv --python 3.10 .venv\nsource .venv/bin/activate\nuv pip install -e '.[analysis,benchmarks,agents]'";
const endpointCommand = "export OPENAI_BASE_URL=\"https://your-provider.example/v1\"\nexport OPENAI_API_KEY=\"your-api-key\"\nexport OPENAI_MODEL_NAME=\"Qwen/Qwen3.5-27B\"";
const imageCommand = "podman build \\\n  -f alphadiana/harness/opencode/deploy/Containerfile.podman-controller \\\n  -t localhost/alphadiana-opencode-podman:latest \\\n  alphadiana/harness/opencode/deploy";
const cliCommand = "alphadiana validate configs/examples/aime2026_opencode.yaml\nalphadiana compute configs/examples/aime2026_opencode.yaml\nalphadiana analyzer results/aime_opencode_cli.jsonl --output-dir figures/aime_opencode_cli";
const apiCommand = "import alphadiana as ad\n\nagent = ad.agent(\n    \"opencode\", version=\"1.3.2\", controller_mode=\"podman\",\n    controller_image=\"localhost/alphadiana-opencode-podman:latest\",\n)\ndata = ad.dataset(\"MathArena/aime_2026\", benchmark=\"aime\", max_tasks=3)\nscorer = ad.scorer.create(\"numeric\")\n\nartifacts = ad.runner(\n    run_id=\"aime_opencode_api\", num_samples=1, task_retries=0, strict_report=True,\n).compute(agent=agent, data=data, scorer=scorer)\n\nad.analyzer(artifacts).export(\"figures/aime_opencode_api\")";

export function ResearchHome({paperLayout = false}: {paperLayout?: boolean}): ReactNode {
  return (
    <Layout
      title="AlphaDiana"
      description={productTagline}>
      {paperLayout && <Head><meta name="robots" content="noindex, nofollow" /></Head>}
      <main>
        <div className={`${styles.container} ${paperLayout ? styles.paper : ''}`}>
          {paperLayout ? <>
            <div className={styles.previewBar}>Paper-page layout preview <Link to="/">Compare current layout ↗</Link></div>
            <header className={styles.paperHeader}>
              <p className={styles.paperEyebrow}>arXiv · October 2026</p>
              <h1><span>AlphaDiana</span>{paperTitle.replace('AlphaDiana: ', '')}</h1>
              <p className={styles.paperDeck}>Compare scores and traces on verifiable reasoning tasks.<br />Test tools, skills and memory.</p>
              <details className={styles.authors}>
                <summary>Authors</summary>
                <p>{paperBibtex.match(/author=\{([^}]+)\}/)?.[1].split(' and ').join(' · ')}</p>
              </details>
              <div className={styles.paperLinks}>
                <a href={paperUrl}>Paper ↗</a>
                <a href={codeUrl}>Code ↗</a>
                <Link to="/docs/intro">Docs ↗</Link>
                <a href="#quick-start">Quick Start ↓</a>
              </div>
            </header>
            <nav className={styles.sectionNav} aria-label="On this page">
              <a href="#positioning">Positioning</a><a href="#why-alphadiana">Motivation</a>
              <a href="#scope">Scope</a><a href="#quick-start">Quick Start</a>
              <a href="#documentation">Docs</a><a href="#citation">Citation</a>
              <a href="#related-project">Related project</a>
            </nav>
          </> : <Hero
            title="AlphaDiana"
            description={productTagline}
            primaryButtonText="Get Started"
            primaryButtonLink="/docs/intro"
            secondaryButtonText="GitHub"
            secondaryButtonLink={codeUrl}
            paperButtonText="Paper"
            paperButtonLink={paperUrl}
          />}

          <section className={styles.introSection}>
            <div className={styles.introContent}>
              <p>
                Compare scores and traces on verifiable reasoning tasks. Test tools, skills and memory.
                AlphaDiana runs agents on benchmarks, scores their answers and saves execution evidence for later analysis.
              </p>
            </div>
          </section>

          <section id="positioning" className={styles.motivationBand}>
            <h2>Positioning</h2>
            <p>A harness controls how a model uses prompts, tools and persistent state. Changing the harness can change the behavior of the same model.</p>
            <figure className={styles.motivationFigure}>
              <img src="/img/paper/position.png" alt="From model-centric to harness-aware evaluation" loading="lazy" />
              <figcaption>
                <strong>Figure 1. Position of AlphaDiana.</strong> A foundation model is an <em>engine</em>{' '}
                evaluated by stateless prompt-in/answer-out scoring; an agent is the <em>car</em> that embeds the model
                in a runtime with control, tools, state, policies, and sandbox constraints. AlphaDiana acts as the{' '}
                <em>tournament organizer</em>: it fixes evaluation rules across agents, runs them on shared benchmark
                tracks, and logs canonical traces for analyzing correctness, efficiency, reliability, and failures. Original figure from the <a href={paperUrl}>paper</a>.
              </figcaption>
            </figure>
          </section>

          <section id="why-alphadiana" className={styles.architectureBand}>
            <div className={styles.architectureFigure}>
              <h2>Why AlphaDiana?</h2>
              <ul className={styles.whyList}>
                <li><strong>Compare agents:</strong> compare scores and resource use across model–harness combinations on the same tasks.</li>
                <li><strong>Inspect failures:</strong> trace wrong answers through execution status, tool interactions and saved action patterns.</li>
                <li><strong>Test components:</strong> change tools, skills or memory and compare outcomes under recorded tasks and budgets.</li>
              </ul>
              <figure>
                <img src="/img/readme/alphadiana-overview.png" alt="README overview of execution evidence, scores, failure labels, resource usage and component comparisons" loading="lazy" />
                <figcaption>Measurement examples from the finalized README. Each plot labels its model, benchmark and metric.</figcaption>
              </figure>
            </div>
          </section>
          <section id="scope" className={styles.architectureBand}>
            <div className={styles.architectureFigure}>
              <h2>Scope at a glance</h2>
              <div className={styles.scopeTable}><table>
                <thead><tr><th>Layer</th><th>What you can configure or measure</th></tr></thead>
                <tbody>
                  <tr><th>Configure</th><td>OpenAI-compatible models; <Link to="/docs/harnesses/">OpenCode, OpenClaw, ZeroClaw, Pi, DeepSeek Harness and benchmark-specific agents</Link>; tools, skills, memory and prompts; <Link to="/docs/architecture/sandboxes">supported host, Docker or Podman runtimes</Link>.</td></tr>
                  <tr><th>Run</th><td><Link to="/docs/benchmarks/">AIME 2026, GPQA-Diamond, HLE, IMO-AnswerBench, MMMU-Pro, SWE-bench Verified and Terminal-Bench 2</Link>, plus custom tasks. Control repeats, sampling, budgets, concurrency, retries and state isolation through CLI/YAML or Python.</td></tr>
                  <tr><th>Measure</th><td>Accuracy, Pass@k, Avg@k, execution status and failure labels; output tokens, wall time and cost per correct answer; action composition, transitions and token/post-tool entropy. Export tables, figures, source hashes and evidence coverage.</td></tr>
                  <tr><th>Extend</th><td><Link to="/docs/architecture/registries">Register harnesses, benchmarks, environments, scorers and metrics</Link>, or add saved-run analysis plugins.</td></tr>
                </tbody>
              </table></div>
              <p>Entropy requires captured probabilities; action and failure labels require an explicitly enabled analysis model. Compare runs with matched scorers, isolation and budgets, and read Pass@k / Avg@k with the configured repeat count.</p>
            </div>
          </section>
          <section id="quick-start" className={styles.quickstartSection}>
            <div className={styles.quickstartContent}>
              <p className={styles.kicker}>Quick Start</p>
              <h2>Run OpenCode on three AIME 2026 tasks</h2>
              <p>Choose CLI or Python API after the shared setup. Both use one sample per task, no task retries, and strict reporting, then analyze saved results. Requires uv, Python ≥ 3.10, Podman and an OpenAI-compatible endpoint.</p>
              <p className={styles.versionNote}>These examples follow the finalized development README. The public mirror has not yet received this API and preset; use the pinned development checkout below. See the <Link to="/docs/getting-started/quick-start">complete guide</Link> for version and runtime requirements. This is a pipeline check, not the paper's full protocol.</p>
              <details className={styles.setupDetails} open={!paperLayout}>
              <summary>Shared setup · environment, endpoint and Podman image</summary>
              <h3>1. Install</h3><InstallBox command={installCommand} />
              <h3>2. Set up the model endpoint</h3><InstallBox command={endpointCommand} />
              <h3>3. Build the OpenCode controller image</h3><InstallBox command={imageCommand} />
              </details>
              <h3>4. Run and analyze</h3>
              <Tabs groupId="quickstart-interface">
                <TabItem value="cli" label="CLI" default>
                  <h3>Compute, analyze and export</h3><InstallBox command={cliCommand} />
                  <p>Saved attempts: <code>results/aime_opencode_cli.jsonl</code>. Exports: <code>figures/aime_opencode_cli/</code>.</p>
                </TabItem>
                <TabItem value="python" label="Python API">
                  <h3>Compute, analyze and export</h3><InstallBox command={apiCommand} language="python" />
                  <p>Saved attempts: <code>results/aime_opencode_api.jsonl</code>. Exports: <code>figures/aime_opencode_api/</code>.</p>
                </TabItem>
              </Tabs>
              <p>Exports include measurement tables, PDF/SVG/PNG figures, plotted data, source hashes and evidence coverage. Default analysis reads saved evidence. <Link to="/docs/getting-started/python-api#optional-model-judgments">Optional action and failure annotations</Link> make additional analysis-model calls.</p>
            </div>
          </section>
          <section id="python-api" className={styles.architectureBand}>
            <figure className={styles.architectureFigure}>
              <p className={styles.kicker}>Measurement API</p>
              <h2>Compose tasks, agents, environments, and scoring</h2>
              <p className={styles.flowLead}>
                Select the agent, dataset and scorer separately, then pass them to the runner.
                The <Link to="/docs/getting-started/python-api">Python API example</Link> runs OpenCode on three
                AIME tasks and exports scores, traces and figures. It includes the required Podman image setup.
              </p>
              <a href="/img/paper/api.png" aria-label="Open the original API figure at full size">
                <img src="/img/paper/api.png" alt="Paper Figure 4: dataset, agent, scorer, runner, environment, and analyzer interfaces" loading="lazy" />
              </a>
              <figcaption><strong>Figure 4. Functional interface of AlphaDiana.</strong> Original paper illustration, including its example measurements.</figcaption>
            </figure>
          </section>

          <section id="documentation" className={styles.architectureBand}>
            <figure className={styles.architectureFigure}>
              <p className={styles.kicker}>Documentation</p>
              <h2>Configure, execute, save evidence, analyze</h2>
              <p className={styles.flowLead}>
                Configuration selects the tasks, agents, environments, and scorers. The runner allocates sessions,
                calls native harness runtimes, and saves execution artifacts and scorer judgments. The analyzer
                uses normalized traces and outcome records to compare correctness, behavior, and resource use.
              </p>
              <img
                src="/img/paper/system.png"
                alt="AlphaDiana architecture from experiment configuration through benchmark, agent, environment, scorer, result store, and analysis"
                loading="lazy"
              />
              <figcaption>
                <strong>Figure 3. System design of AlphaDiana.</strong> Original figure from the{' '}
                <a href={paperUrl}>paper</a>; native runtimes retain their execution loops.
              </figcaption>
            </figure>
          </section>

          <Scoreboard />

          <section id="citation" className={styles.citationSection}>
            <div className={styles.citationInner}>
              <p className={styles.kicker}>Citation</p>
              <p><a href={paperUrl}>{paperTitle}</a>. arXiv:2610.20675, published 14 October 2026.</p>
              <p>If you find the project helpful, please cite:</p>
              <pre className={styles.citationBib}>{paperBibtex}</pre>
              <p>We thank contributors, collaborators and open-source communities behind{' '}
                <a href="https://github.com/openclaw/openclaw">OpenClaw</a>,{' '}
                <a href="https://github.com/alibaba/ROCK">ROCK</a> and other tools.</p>
              <h2 id="related-project">Related project</h2>
              <p>Please also check out <a href="https://alphaapollo.org/">AlphaApollo</a>, our system for deep
                agentic reasoning (<a href="https://arxiv.org/abs/2510.06261">arXiv</a>,{' '}
                <a href="https://github.com/tmlr-group/AlphaApollo">GitHub</a>).</p>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}

export default function Home(): ReactNode {
  return <ResearchHome />;
}
