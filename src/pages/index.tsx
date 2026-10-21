import { paperTitle, paperUrl, paperBibtex, productTagline, codeUrl } from '@site/src/data/publication';
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
    icon: TraceIcon,
    title: 'Reproducible Reports',
    description: 'Reopen saved runs and export tables, figures, source hashes, and evidence coverage.',
  },
];

const installCommand = `git clone https://github.com/AndrewZhou924/AlphaDiana-dev.git
cd AlphaDiana-dev
python -m venv .venv
source .venv/bin/activate
pip install -e '.[analysis,benchmarks,agents]'`;

const runCommand = `export OPENAI_BASE_URL="https://your-provider.example/v1"
export OPENAI_API_KEY="your-api-key"
export OPENAI_MODEL_NAME="Qwen/Qwen3.5-27B"

# Validate, then run one task with one sample
alphadiana validate configs/macro_runs/aime2026_directllm_qwen35_27b.yaml \\
  -o benchmark.config.max_tasks=1
alphadiana run configs/macro_runs/aime2026_directllm_qwen35_27b.yaml \\
  -o run_id=quickstart_aime_directllm_t1_k1 \\
  -o benchmark.config.max_tasks=1 \\
  -o num_samples=1

# Print a report from saved attempts
alphadiana report results/`;

export default function Home(): ReactNode {
  return (
    <Layout
      title="AlphaDiana"
      description={productTagline}>
      <main>
        <div className={styles.container}>
          <Hero
            title="AlphaDiana"
            description={productTagline}
            primaryButtonText="Get Started"
            primaryButtonLink="/docs/intro"
            secondaryButtonText="GitHub"
            secondaryButtonLink={codeUrl}
            paperButtonText="Read the Paper"
            paperButtonLink={paperUrl}
          />

          <section className={styles.introSection}>
            <div className={styles.introContent}>
              <p>
                Compare scores, inspect trajectories, and test tools, skills and memory.
                AlphaDiana runs configured agents against benchmarks, scores their outputs, and saves the
                evidence needed to analyze each attempt.
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

          <FeaturesGrid title="What AlphaDiana standardizes" features={features} background="white" />

          <Scoreboard />

          <section className={styles.quickstartSection}>
            <div className={styles.quickstartContent}>
              <p className={styles.kicker}>Quick Start</p>
              <h2>Run one AIME 2026 task with DirectLLM</h2>
              <p className={styles.flowLead}>
                Follow the latest README: connect a Qwen3.5-27B endpoint, validate the preset, and save one scored
                attempt. This direct model call needs Python 3.10 or newer and no task container. The preset requires
                streaming, logprobs, and thinking-option support. This is a smoke test, not the paper protocol.
                See the <Link to="/docs/getting-started/quick-start">complete quick start</Link> for settings and outputs.
              </p>
              <div className={styles.installGrid}>
                <div>
                  <h3>1. Install</h3>
                  <InstallBox command={installCommand} language="bash" />
                </div>
                <div>
                  <h3>2. Connect and run</h3>
                  <InstallBox command={runCommand} language="bash" />
                </div>
              </div>
            </div>
          </section>

          <section className={styles.citationSection}>
            <div className={styles.citationInner}>
              <p className={styles.kicker}>Citation</p>
              <p><a href={paperUrl}>{paperTitle}</a>. arXiv:2610.20675, published 14 October 2026.</p>
              <p>If you find the project helpful, please cite:</p>
              <pre className={styles.citationBib}>{paperBibtex}</pre>
              <p>We thank the contributors, collaborators and open-source communities behind{' '}
                <a href="https://github.com/openclaw/openclaw">OpenClaw</a>,{' '}
                <a href="https://github.com/alibaba/ROCK">ROCK</a> and the other tools that support AlphaDiana.</p>
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
