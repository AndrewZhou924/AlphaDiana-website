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

const macroFindings = [
  {
    tag: 'Model',
    title: 'Harnessing is not model-agnostic',
    body: 'The study reports different harness effects across Qwen3.5-27B, Gemma-4-31B-IT, and Kimi-K2.6. Scores should be read as properties of model-harness-task triples.',
  },
  {
    tag: 'Task',
    title: 'Benefits depend on task structure',
    body: 'The reported results suggest task-dependent effects. Interpret each comparison in the context of its model, task, scorer, and runtime conditions.',
  },
  {
    tag: 'Harness',
    title: 'No harness is uniformly best',
    body: 'The reported results contain both gains and losses across harnesses. No single harness is uniformly best across the evaluated model-task combinations.',
  },
];

const macroFigures = [
  {
    src: '/img/analysis/action-composition-qwen.png',
    title: 'Qwen3.5 action composition',
    caption: 'Action-category breakdown for correct and incorrect trajectories.',
  },
  {
    src: '/img/analysis/action-composition-gemma.png',
    title: 'Gemma action composition',
    caption: 'Outcome-conditioned action breakdown using the shared taxonomy.',
  },
  {
    src: '/img/analysis/post-tool-entropy-qwen.png',
    title: 'Qwen3.5 post-tool entropy',
    caption: 'Post-tool entropy comparison across recorded outcomes.',
  },
  {
    src: '/img/analysis/post-tool-entropy-gemma.png',
    title: 'Gemma post-tool entropy',
    caption: 'Post-tool entropy comparison for Gemma model-harness combinations.',
  },
];

const microFindings = [
  {
    tag: 'Tool',
    title: 'Tool access is harness-conditioned',
    body: 'The ablation results show different tool-condition effects across ZeroClaw and OpenCode. Tool filtering also changes prompt conditions, so this is not a pure one-variable causal estimate.',
  },
  {
    tag: 'Skill',
    title: 'Skill loading depends on selection behavior',
    body: 'The skill-use analysis compares math and general skill read rates, highlighting differences in how harnesses select supporting knowledge.',
  },
  {
    tag: 'Memory',
    title: 'Memory behavior is harness-specific',
    body: 'Memory comparisons must name the persistence boundary and complete prompt/runtime condition. The current checkout ships only one Cross-Task memory config.',
  },
];

const microFigures = [
  {
    src: '/img/micro/skill-use-qwen-zeroclaw.png',
    title: 'Qwen3.5 + ZeroClaw skill use',
    caption: 'Comparison of math-skill and general-skill read rates.',
  },
  {
    src: '/img/micro/skill-use-qwen-opencode.png',
    title: 'Qwen3.5 + OpenCode skill use',
    caption: 'OpenCode comparison of math-skill and general-skill read rates.',
  },
  {
    src: '/img/micro/memory-cross-task-opencode.png',
    title: 'OpenCode cross-task memory',
    caption: 'OpenCode accuracy under a cross-task memory condition.',
  },
  {
    src: '/img/micro/memory-cross-task-openclaw.png',
    title: 'OpenClaw cross-task memory',
    caption: 'OpenClaw cross-task memory condition compared with its baseline.',
  },
  {
    src: '/img/micro/memory-cross-task-zeroclaw.png',
    title: 'ZeroClaw cross-task memory',
    caption: 'ZeroClaw cross-task memory condition compared with its baseline.',
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
alphadiana validate configs/examples/openclaw_aime2024.yaml \\
  -o benchmark.config.max_tasks=1
alphadiana run configs/examples/openclaw_aime2024.yaml \\
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
      description="AlphaDiana: A System for Evaluating Reasoning Agents.">
      <main>
        <div className={styles.container}>
          <Hero
            title="AlphaDiana"
            description="A System for Evaluating Reasoning Agents"
            primaryButtonText="Get Started"
            primaryButtonLink="/docs/intro"
            secondaryButtonText="GitHub"
            secondaryButtonLink="https://github.com/tmlr-group/AlphaDiana"
          />

          <section className={styles.introSection}>
            <div className={styles.introContent}>
              <p>
                Reasoning agents such as OpenClaw are <strong>model-harness systems</strong>. The model supplies
                reasoning capacity, while the harness realizes it through tool use, multi-turn control, execution
                feedback, memory, and runtime policy. This shifts the paradigm from <em>model</em> reasoning to{' '}
                <em>agentic</em> reasoning. Existing evaluations often test models without a harness or
                fix a single harness, which conflates base-model reasoning with harness orchestration, leaving it
                unclear whether gains reflect stronger models or specific harness components.
              </p>
            </div>
          </section>

          <section className={styles.motivationBand}>
            <figure className={styles.motivationFigure}>
              <img src="/img/motivation.png" alt="From model-centric to harness-aware evaluation" loading="lazy" />
              <figcaption>
                <strong>From model-centric to harness-aware evaluation.</strong> A foundation model is an <em>engine</em>{' '}
                evaluated by stateless prompt-in/answer-out scoring; an agent is the <em>car</em> that embeds the model
                in a runtime with control, tools, state, policies, and sandbox constraints. AlphaDiana acts as the{' '}
                <em>tournament organizer</em>: it fixes evaluation rules across agents, runs them on shared benchmark
                tracks, and logs canonical traces for analyzing correctness, efficiency, reliability, and failures.
              </figcaption>
            </figure>
          </section>

          <section className={styles.architectureBand}>
            <figure className={styles.architectureFigure}>
              <p className={styles.kicker}>System Architecture</p>
              <h2>One runner, explicit evaluation boundaries</h2>
              <p className={styles.flowLead}>
                AlphaDiana resolves this conflation by making the evaluation process explicit, modular, and auditable:
                an experiment run is represented as{' '}
                <span
                  className={styles.formula}
                  role="math"
                  aria-label="R equals U of B, f theta, H, E, S, and C">
                  <span className={styles.mathSymbol}>ℛ</span> = <span className={styles.mathSymbol}>𝒰</span>(
                  <span className={styles.mathSymbol}>ℬ</span>, <span className={styles.mathFunction}>f<sub>θ</sub></span>,{' '}
                  <span className={styles.mathSymbol}>ℋ</span>, <span className={styles.mathSymbol}>ℰ</span>,{' '}
                  <span className={styles.mathSymbol}>𝒮</span>, <span className={styles.mathSymbol}>𝒞</span>)
                </span>
                , where <em>ℛ</em> denotes saved results, <em>𝒰</em> the shared runner, <em>ℬ</em> the benchmark,{' '}
                <span className={styles.mathFunction}>f<sub>θ</sub></span> the base model, <em>ℋ</em> the agent harness,
                <em>ℰ</em> the execution environment, <em>𝒮</em> outcome and process evaluation, and <em>𝒞</em> the run
                configuration. Together, the model and harness form the evaluated agent{' '}
                <span className={styles.formulaInline} role="math" aria-label="A theta H equals H composed with f theta">
                  <span className={styles.mathSymbol}>𝒜</span><sub>θ,ℋ</sub> = <span className={styles.mathSymbol}>ℋ</span> ⊙{' '}
                  <span className={styles.mathFunction}>f<sub>θ</sub></span>
                </span>
                ; Direct is its no-tool control.
              </p>
              <img
                src="/img/alphadiana-architecture.svg"
                alt="AlphaDiana architecture from experiment configuration through benchmark, agent, environment, scorer, result store, and analysis"
                loading="lazy"
              />
              <figcaption>
                <strong>Architecture of AlphaDiana.</strong> The shared runner connects experiment configuration,
                agent execution, scoring, result storage, and analysis in one auditable workflow.
              </figcaption>
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
                  <figcaption>Inspect the completed run with Pass@4, Avg@4, token usage, and runtime statistics.</figcaption>
                </figure>
              </div>
            </div>
          </section>

          <Scoreboard />

          {/*
          <section className={styles.findingsSection}>
            <div className={styles.findingsInner}>
              <p className={styles.kicker}>Macro Findings</p>
              <h2>What the reported results illustrate</h2>
              <div className={styles.findingsGrid}>
                {macroFindings.map((f) => (
                  <div key={f.tag} className={styles.findingCard}>
                    <span className={styles.findingTag}>{f.tag} perspective</span>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </div>
                ))}
              </div>
              <p className={styles.findingsNote}>
                Direct inference is the reference condition for comparing orchestration outcomes when the shared
                model, task, scorer, and budget contract is matched.
              </p>
            </div>
          </section>

          <section className={styles.analysisSection}>
            <div className={styles.analysisInner}>
              <p className={styles.kicker}>Process Analysis</p>
              <h2>Scores are only the entry point</h2>
              <p className={styles.flowLead}>
                AlphaDiana preserves trajectories, actions, tool feedback, and token-level uncertainty. These plots
                from the study show why a model-harness system succeeds or fails after the final score is known.
              </p>
              <div className={styles.figureGrid}>
                {macroFigures.map((figure) => (
                  <figure key={figure.src} className={styles.analysisFigure}>
                    <img src={figure.src} alt={figure.title} loading="lazy" />
                    <figcaption>
                      <strong>{figure.title}.</strong> {figure.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.microSection}>
            <div className={styles.microInner}>
              <p className={styles.kicker}>Micro Findings</p>
              <h2>Capability conditions contextualize the shifts</h2>
              <p className={styles.flowLead}>
                The micro study compares matched harness conditions for tools, skills, and memory. A condition may
                include both prompt and runtime changes, so interpret each delta as a bundle rather than an isolated
                causal effect.
              </p>
              <div className={styles.findingsGrid}>
                {microFindings.map((f) => (
                  <div key={f.tag} className={styles.findingCard}>
                    <span className={styles.findingTag}>{f.tag} axis</span>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </div>
                ))}
              </div>
              <div className={styles.microFigureGrid}>
                {microFigures.map((figure) => (
                  <figure key={figure.src} className={styles.microFigure}>
                    <img src={figure.src} alt={figure.title} loading="lazy" />
                    <figcaption>
                      <strong>{figure.title}.</strong> {figure.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
          */}

          <section className={styles.quickstartSection}>
            <div className={styles.quickstartContent}>
              <p className={styles.kicker}>Quick Start</p>
              <h2>Run an AIME OpenClaw smoke evaluation</h2>
              <p className={styles.flowLead}>
                The command below uses <code>configs/examples/openclaw_aime2024.yaml</code> with the ROCK-managed
                OpenClaw runtime, downscaled to one problem and one sample. Connect it to a local model server or a
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
              <pre className={styles.citationBib}>
{`@inproceedings{
  zhou2026reasoning,
  title={Reasoning Is More Than the Model: Harness-Aware Evaluation of Agents on Verifiable Reasoning Tasks},
  author={Zhanke Zhou and Zongze Li and Weikai Huang and Xuan Li and Chentao Cao and Xiao Feng and Xiangyu Lu and Jinbo Hu and Menghan Lu and Yi Xie and Nico Pelleriti and Shiyang Liu and Max Zimmer and Brando Miranda and Jiangchao Yao and Bo Liu and Sanmi Koyejo and Sebastian Pokutta and Bo Han},
  booktitle={ICML 2026 Workshop: AI as a Tool for Mathematics, Computer Science, and Machine Learning},
  year={2026},
  url={https://openreview.net/forum?id=fnHhEf0cSE}
}

@inproceedings{
  zhou2026reasoning,
  title={Reasoning Is More Than the Model: Harness-Aware Evaluation of Agents on Verifiable Reasoning Tasks},
  author={Zhanke Zhou and Zongze Li and Weikai Huang and Xuan Li and Chentao Cao and Xiao Feng and Xiangyu Lu and Jinbo Hu and Menghan Lu and Yi Xie and Nico Pelleriti and Shiyang Liu and Max Zimmer and Brando Miranda and Jiangchao Yao and Bo Liu and Sanmi Koyejo and Sebastian Pokutta and Bo Han},
  booktitle={3rd AI for Math Workshop: Toward Self-Evolving Scientific Agents},
  year={2026},
  url={https://openreview.net/forum?id=4vARlk9o95}
}`}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
