import { paperVersionUrl } from '@site/src/data/publication';
import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/** Values transcribed from Figure 5, arXiv:2610.20675v1, page 6.
 * AIME uses Pass@4 and Avg@4; other answer-based benchmarks use Avg@1.
 * Deltas are computed from the displayed, one-decimal paper values.
 */

interface Row {
  harness: string;
  vals: number[];
}

interface Model {
  id: string;
  name: string;
  verdict: 'hurts' | 'helps' | 'mixed';
  takeaway: string;
  rows: Row[];
}

const metrics = [
  { name: 'IMO-AnswerBench', metric: 'Avg@1' },
  { name: 'HLE-Verifiable', metric: 'Avg@1' },
  { name: 'GPQA-Diamond', metric: 'Avg@1' },
  { name: 'AIME 26', metric: 'Pass@4' },
  { name: 'AIME 26', metric: 'Avg@4' },
  { name: 'MMMU-Pro', metric: 'Avg@1' },
];

const models: Model[] = [
  {
    id: 'qwen',
    name: 'Qwen3.5-27B',
    verdict: 'hurts',
    takeaway: 'Direct inference leads every harness row in this selected comparison.',
    rows: [
      { harness: 'Direct', vals: [58.3, 23.0, 80.3, 96.7, 89.2, 73.4] },
      { harness: 'OpenClaw', vals: [20.3, 13.4, 66.2, 83.3, 64.2, 68.3] },
      { harness: 'ZeroClaw', vals: [17.5, 15.0, 77.8, 86.7, 69.2, 67.2] },
      { harness: 'OpenCode', vals: [15.8, 13.9, 73.2, 86.7, 66.7, 69.4] },
    ],
  },
  {
    id: 'gemma',
    name: 'Gemma-4-31B-IT',
    verdict: 'helps',
    takeaway: 'Several harness rows improve on IMO, GPQA, and AIME in this selected comparison.',
    rows: [
      { harness: 'Direct', vals: [59.0, 27.9, 83.3, 96.7, 92.5, 65.8] },
      { harness: 'OpenClaw', vals: [59.5, 24.2, 85.4, 100.0, 97.5, 56.8] },
      { harness: 'ZeroClaw', vals: [61.5, 29.1, 86.4, 100.0, 96.7, 66.4] },
      { harness: 'OpenCode', vals: [62.5, 24.0, 87.9, 100.0, 96.7, 67.4] },
    ],
  },
  {
    id: 'kimi',
    name: 'Kimi-K2.6',
    verdict: 'mixed',
    takeaway: 'The selected results contain a mixture of gains and losses against Direct.',
    rows: [
      { harness: 'Direct', vals: [42.0, 35.9, 77.8, 96.7, 85.8, 75.1] },
      { harness: 'OpenClaw', vals: [27.3, 40.7, 31.8, 93.3, 72.5, 48.6] },
      { harness: 'ZeroClaw', vals: [38.7, 33.7, 87.4, 100.0, 93.3, 64.7] },
      { harness: 'OpenCode', vals: [48.5, 33.9, 80.8, 100.0, 86.7, 71.3] },
    ],
  },
];

const verdictLabel: Record<Model['verdict'], string> = {
  hurts: 'Lower overall',
  helps: 'Task-dependent gains',
  mixed: 'Mixed',
};

function Cell({ value, delta }: { value: number; delta: number | null | undefined }) {
  if (delta === null || delta === undefined) {
    return <td className={styles.baseCell}>{value.toFixed(1)}</td>;
  }
  const sign = delta > 0 ? 'pos' : delta < 0 ? 'neg' : 'zero';
  return (
    <td className={clsx(styles.deltaCell, styles[sign])}>
      <span className={styles.cellVal}>{value.toFixed(1)}</span>
      <span className={styles.cellDelta}>
        {delta > 0 ? '+' : ''}
        {delta.toFixed(1)}
      </span>
    </td>
  );
}

export default function Scoreboard() {
  const [active, setActive] = useState(0);
  const model = models[active];

  return (
    <section id="results" className={clsx('section-gray', styles.section)}>
      <div className={styles.inner}>
        <p className={styles.kicker}>Published Results</p>
        <h2 className={styles.heading}>Harness gains depend on the model, task, and harness</h2>
        <p className={styles.subhead}>
          The reported results compare the <strong>Direct</strong> no-harness baseline with open harnesses under matched
          models, tasks, scorers, and shared budgets while recording harness-specific runtime conditions. Harnessing
          is <strong>not</strong> a uniform upgrade: effects vary across models and tasks. <span className={styles.legendPos}>Green</span>{' '}
          means the harness beat Direct;{' '}
          <span className={styles.legendNeg}>red</span> means it lost ground.
        </p>
        <div className={styles.findings}>
          <div className={styles.finding}>
            <strong>Model perspective.</strong> Harnessing is not a model-agnostic improvement.
            On these answer-based benchmarks, the evaluated harnesses lower Qwen3.5-27B's average accuracy, help Gemma-4-31B-IT on several
            answer-based tasks, and yield mixed outcomes for Kimi-K2.6.
          </div>
          <div className={styles.finding}>
            <strong>Task perspective.</strong> Harness benefits are task-dependent. Gains on answer-based reasoning do
            not transfer automatically to software-engineering or terminal tasks, where every evaluated harness either
            matches or trails the task-native reference.
          </div>
          <div className={styles.finding}>
            <strong>Harness perspective.</strong> No harness is uniformly best. Each harness has configurations in which
            it is competitive and others in which it causes a substantial loss, so scores should be read as properties of
            model-harness-task triples.
          </div>
        </div>

        <div className={styles.tabs} role="group" aria-label="Select model results">
          {models.map((m, i) => (
            <button
              key={m.id}
              aria-pressed={i === active}
              className={clsx(styles.tab, i === active && styles.activeTab)}
              onClick={() => setActive(i)}
              type="button">
              {m.name}
            </button>
          ))}
        </div>

        <div className={styles.boardWrap}>
          <div className={styles.boardTop}>
            <span className={styles.modelName}>{model.name}</span>
            <span className={clsx(styles.verdict, styles[`v_${model.verdict}`])}>{verdictLabel[model.verdict]}</span>
          </div>

          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.cornerTh}>Harness</th>
                  {metrics.map((m, i) => (
                    <th key={i}>
                      <span className={styles.mName}>{m.name}</span>
                      <span className={styles.mMetric}>{m.metric}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {model.rows.map((row) => (
                  <tr key={row.harness} className={clsx(row.harness === 'Direct' && styles.baseRow)}>
                    <th scope="row" className={styles.rowHead}>
                      {row.harness}
                      {row.harness === 'Direct' && <span className={styles.baseTag}>baseline</span>}
                    </th>
                    {row.vals.map((v, i) => (
                      <Cell key={i} value={v} delta={row.harness === 'Direct' ? null : Number((v - model.rows[0].vals[i]).toFixed(1))} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.takeaway}>{model.takeaway}</p>
        </div>

        <p className={styles.footnote}>
          Values are percentages (higher is better); deltas are absolute differences vs. Direct. This view presents
          the five answer-based benchmarks in <a href={paperVersionUrl}>Figure 5 of arXiv:2610.20675v1</a>.
          AIME 26 has 30 problems and four attempts per problem: Avg@4 averages correctness over 120 attempts;
          Pass@4 is the fraction solved at least once. Deltas use the rounded values shown here.
          See <a href="/docs/paper">study scope, interactive results, and measurement limits</a>.
        </p>
      </div>
    </section>
  );
}
