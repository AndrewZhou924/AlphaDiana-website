import { paperTitle, paperUrl, paperBibtex } from '@site/src/data/publication';
import Hero from '@site/src/components/Hero';
import FeaturesGrid from '@site/src/components/FeaturesGrid';
import InstallBox from '@site/src/components/InstallBox';
import Scoreboard from '@site/src/components/Scoreboard';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import React, { ReactNode } from 'react';
import {
  StandardizedIcon,
  AgentIcon,
  SandboxIcon,
  BalanceIcon,
  TargetIcon,
  TraceIcon,
  DashboardIcon,
  ConcurrencyIcon,
} from '@site/src/components/icons/FeatureIcons';
import styles from './index.module.css';

const features = [
  {
    icon: BalanceIcon,
    title: 'Harness-Aware Evaluation',
    description: 'Treat the evaluated unit as model plus harness, with Direct inference as the control.',
  },
  {
    icon: TargetIcon,
    title: 'Controlled Comparison',
    description: 'Match the model, task, scorer, and shared budgets while disclosing harness-specific runtime conditions.',
  },
  {
    icon: AgentIcon,
    title: 'Open Harness Interfaces',
    description: 'Run direct inference and reasoning agent harnesses through one shared result schema.',
  },
  {
    icon: StandardizedIcon,
    title: 'Verifiable Reasoning Tasks',
    description: 'Use deterministic or programmatic scorers for math, science, multimodal, and coding tasks.',
  },
  {
    icon: TraceIcon,
    title: 'Trajectory Attribution',
    description: 'Log actions, observations, resource use, termination states, and scoring metadata.',
  },
  {
    icon: SandboxIcon,
    title: 'Sandboxed Execution',
    description: 'Run supported tool-using paths in task-scoped environments with explicit resource and reset policies.',
  },
  {
    icon: ConcurrencyIcon,
    title: 'Macro And Micro Studies',
    description: 'Compare whole harnesses, then ablate tools, skills, and memory to explain the score shifts.',
  },
  {
    icon: DashboardIcon,
    title: 'Reproducible Reports',
    description: 'Regenerate summaries from saved records and inspect the evaluation loop in the dashboard.',
  },
];

const installCommand = `git clone https://github.com/tmlr-group/AlphaDiana
cd AlphaDiana

# Required by the security preflight in the current release
export OPENCLAW_GATEWAY_TOKEN="$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')"

# Checkout-local conda env, dependencies, and services
bash scripts/quickstart.sh`;

const runCommand = `# Activate the environment once per terminal
source scripts/activate.sh

# Use either a local OpenAI-compatible model server:
export OPENAI_MODEL_NAME="your-local-model"
export OPENAI_BASE_URL="http://127.0.0.1:8000/v1"
export OPENAI_API_KEY="sk-local"

# Or a hosted API (replace the three values above):
# export OPENAI_MODEL_NAME="your-api-model"
# export OPENAI_BASE_URL="https://your-provider.example/v1"
# export OPENAI_API_KEY="your-api-key"

# Validate and run a one-task AIME OpenClaw smoke
alphadiana validate configs/macro_runs/aime2026_openclaw_qwen35_27b.yaml \\
  -o benchmark.config.max_tasks=1
alphadiana run configs/macro_runs/aime2026_openclaw_qwen35_27b.yaml \\
  -o run_id=quickstart_aime_openclaw_t1_k1 \\
  -o benchmark.config.max_tasks=1 \\
  -o num_samples=1 \\
  -o max_concurrent=1

# Generate a report from the smoke run
alphadiana report results`;

export default function Home(): ReactNode {
  return (
    <Layout
      title="AlphaDiana"
      description={paperTitle}>
      <main>
        <div className={styles.container}>
          <Hero
            title="AlphaDiana"
            description={paperTitle.replace('AlphaDiana: ', '')}
            primaryButtonText="Get Started"
            primaryButtonLink="/docs/intro"
            secondaryButtonText="GitHub"
            secondaryButtonLink="https://github.com/tmlr-group/AlphaDiana"
            paperButtonText="Read the Paper"
            paperButtonLink={paperUrl}
          />

          <section className={styles.introSection}>
            <div className={styles.introContent}>
              <p>
                AlphaDiana measures complete <strong>model-harness systems</strong>: reasoning models together with
                the control loops, tools, skills, and memory that make them agents. It links execution conditions
                to answer correctness, behavior, and resource use, preserving native harness control loops while
                controlling file reuse and memory retention separately. The study compares three models and three
                harnesses on five answer-based benchmarks, with two models also tested on two interactive benchmarks.
              </p>
            </div>
          </section>

          <section className={styles.motivationBand}>
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

          <section className={styles.architectureBand}>
            <figure className={styles.architectureFigure}>
              <p className={styles.kicker}>System Architecture</p>
              <h2>One runner, explicit evaluation boundaries</h2>
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

          <section id="python-api" className={styles.architectureBand}>
            <figure className={styles.architectureFigure}>
              <p className={styles.kicker}>Measurement API</p>
              <h2>Compose tasks, agents, environments, and scoring</h2>
              <p className={styles.flowLead}>
                The paper presents a modular interface for running evaluations and analyzing saved artifacts.
                See <Link to="/docs/getting-started/python-api">API concepts and version availability</Link> before
                copying the schematic calls; the <Link to="/docs/getting-started/quick-start">CLI guide</Link> covers
                the currently published code.
              </p>
              <a href="/img/paper/api.png" aria-label="Open the original API figure at full size">
                <img src="/img/paper/api.png" alt="Paper Figure 4: dataset, agent, scorer, runner, environment, and analyzer interfaces" loading="lazy" />
              </a>
              <figcaption><strong>Figure 4. Functional interface of AlphaDiana.</strong> Original paper illustration, including its example measurements.</figcaption>
            </figure>
          </section>

          <FeaturesGrid title="What AlphaDiana standardizes" features={features} background="white" />

          <section id="dashboard" className={styles.dashboardSection}>
            <div className={styles.dashboardContent}>
              <p className={styles.kicker}>Dashboard</p>
              <h2>Launch, monitor, and compare</h2>
              <p className={styles.flowLead}>
                AlphaDiana turns a declarative configuration into a run, exposes it in a shared result store, and lets
                you monitor and compare evaluations side by side. The screenshots below illustrate the dashboard
                workflow for an AIME 2026 DirectLLM evaluation with four samples per problem. See the{' '}
                <Link to="/docs/dashboard">documentation</Link> for details.
              </p>
              <div className={styles.dashboardGrid}>
                <figure className={styles.dashShot}>
                  <img src="/img/dashboard-create.png" alt="Creating an AIME 2026 Direct LLM evaluation" loading="lazy" />
                  <figcaption>Create an AIME 2026 Direct LLM evaluation from explicit configuration fields.</figcaption>
                </figure>
                <figure className={styles.dashShot}>
                  <img src="/img/dashboard-results.png" alt="AIME 2026 Direct LLM evaluation results" loading="lazy" />
                  <figcaption>Illustrative dashboard run; its displayed scores are separate from the paper results below.</figcaption>
                </figure>
              </div>
            </div>
          </section>

          <Scoreboard />

          <section className={styles.quickstartSection}>
            <div className={styles.quickstartContent}>
              <p className={styles.kicker}>Quick Start</p>
              <h2>Run an AIME OpenClaw smoke evaluation</h2>
              <p className={styles.flowLead}>
                The command below uses <code>configs/macro_runs/aime2026_openclaw_qwen35_27b.yaml</code> with the ROCK-managed
                OpenClaw runtime, downscaled to one problem and one sample. This is a smoke test, not the paper protocol. Connect it to a local model server or a
                hosted API in step 2. See the{' '}
                <Link to="/docs/getting-started/installation">getting-started guide</Link> for setup details.
              </p>
              <div className={styles.installGrid}>
                <div>
                  <h3>1. Install</h3>
                  <InstallBox command={installCommand} language="bash" />
                </div>
                <div>
                  <h3>2. Run</h3>
                  <InstallBox command={runCommand} language="bash" />
                </div>
              </div>
            </div>
          </section>

          <section className={styles.citationSection}>
            <div className={styles.citationInner}>
              <p className={styles.kicker}>Citation</p>
              <p><a href={paperUrl}>{paperTitle}</a>. arXiv:2610.20675, published 14 October 2026.</p>
              <pre className={styles.citationBib}>{paperBibtex}</pre>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
