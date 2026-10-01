import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackRecord } from '../services';
import { useAsync } from '../hooks/useAsync';
import { Icon, type IconName } from '../components/ui/Icon';
import { Card, CardSkeleton, DemoTag } from '../components/ui/primitives';
import { CallCard, ConvictionMeter, OutcomeBadge, RecordStrip, recordSummary } from '../components/trust/Trust';
import type { CallOutcome, Conviction, VisionCall } from '../types/football';
import { cx, formatDateTime, leadTime } from '../utils';

const steps: { icon: IconName; title: string; body: string }[] = [
  { icon: 'shield', title: 'Published before kickoff', body: 'An analyst publishes a call with a conviction level and rationale. Calls close at kickoff.' },
  { icon: 'fingerprint', title: 'Timestamped & locked', body: 'The call is written to an append-only record with a timestamp and content fingerprint. It cannot be edited or deleted.' },
  { icon: 'check', title: 'Graded automatically', body: 'After full time the result is graded against the call. Misses stay visible. Postponed matches are marked void.' },
];

function Breakdown({ title, rows }: { title: string; rows: { label: string; correct: number; decided: number }[] }) {
  return (
    <Card className="card--pad">
      <h3 className="sub-title" style={{ marginTop: 0 }}>{title}</h3>
      <div className="breakdown">
        {rows.map((r) => {
          const pct = r.decided ? r.correct / r.decided : 0;
          return (
            <div key={r.label} className="breakdown__row">
              <span className="breakdown__label">{r.label}</span>
              <div className="breakdown__track">
                <span style={{ width: `${pct * 100}%` }} />
              </div>
              <span className="breakdown__val mono">
                {Math.round(pct * 100)}% <span className="muted">· {r.correct}/{r.decided}</span>
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function group(calls: VisionCall[], key: (c: VisionCall) => string, order?: string[]) {
  const map = new Map<string, { correct: number; decided: number }>();
  calls.forEach((c) => {
    if (c.outcome !== 'Correct' && c.outcome !== 'Missed') return;
    const k = key(c);
    const v = map.get(k) ?? { correct: 0, decided: 0 };
    v.decided++;
    if (c.outcome === 'Correct') v.correct++;
    map.set(k, v);
  });
  const rows = Array.from(map, ([label, v]) => ({ label, ...v }));
  return order ? rows.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label)) : rows.sort((a, b) => b.decided - a.decided);
}

export function TrackRecordPage() {
  const { data, loading } = useAsync(() => trackRecord.getCalls());
  const [league, setLeague] = useState('all');
  const [conviction, setConviction] = useState<'all' | Conviction>('all');
  const [outcome, setOutcome] = useState<'all' | CallOutcome>('all');
  const [showAll, setShowAll] = useState(false);

  const graded = data?.graded ?? [];
  const summary = recordSummary(graded);
  const leagues = Array.from(new Set(graded.map((c) => c.competition)));
  const filtered = useMemo(
    () =>
      graded.filter(
        (c) =>
          (league === 'all' || c.competition === league) &&
          (conviction === 'all' || c.conviction === conviction) &&
          (outcome === 'all' || c.outcome === outcome),
      ),
    [graded, league, conviction, outcome],
  );

  return (
    <div className="container page">
      <header className="page-head">
        <div>
          <span className="eyebrow">Public Track Record</span>
          <h1 className="page-title">Every call. Timestamped before kickoff. Never edited.</h1>
          <p className="muted page-lede">
            Every Vision X1 expert call is recorded before the match starts and graded after it ends. Nothing is removed — including
            the calls we got wrong.
          </p>
        </div>
        <DemoTag label="Demo record" />
      </header>

      {loading ? (
        <CardSkeleton lines={4} />
      ) : (
        <>
          <div className="kpis kpis--record">
            <Card className="kpi-tile">
              <span className="kpi-tile__value">{summary.total}</span>
              <span className="kpi-tile__label">Calls graded</span>
            </Card>
            <Card className="kpi-tile">
              <span className="kpi-tile__value">{Math.round(summary.rate * 100)}%</span>
              <span className="kpi-tile__label">Correct reads ({summary.correct}/{summary.decided})</span>
            </Card>
            <Card className="kpi-tile">
              <span className="kpi-tile__value">{summary.medianLeadHours.toFixed(1)} h</span>
              <span className="kpi-tile__label">Median publication before kickoff</span>
            </Card>
            <Card className="kpi-tile kpi-tile--lock">
              <span className="kpi-tile__value">0</span>
              <span className="kpi-tile__label">Edits after publication</span>
            </Card>
          </div>

          <Card className="card--pad strip-card">
            <div className="block-head">
              <h3 className="sub-title" style={{ margin: 0 }}>Last {graded.length} calls</h3>
              <span className="strip-legend">
                <span className="record-strip__dot record-strip__dot--correct" /> Correct
                <span className="record-strip__dot record-strip__dot--missed" /> Missed
                <span className="record-strip__dot record-strip__dot--void" /> Void
              </span>
            </div>
            <RecordStrip calls={[...graded].reverse()} />
            <div className="strip-axis muted small">
              <span>Older</span>
              <span>Most recent</span>
            </div>
          </Card>

          <section className="how">
            {steps.map((s, i) => (
              <div key={s.title} className="how__step">
                <span className="how__n">{i + 1}</span>
                <span className="feature__icon">
                  <Icon name={s.icon} size={20} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </section>

          <div className="grid grid--2">
            <Breakdown title="By analyst conviction" rows={group(graded, (c) => c.conviction, ['High', 'Medium', 'Low'])} />
            <Breakdown title="By competition" rows={group(graded, (c) => c.competition)} />
          </div>

          {data && data.pending.length > 0 && (
            <section className="tr-section">
              <div className="block-head">
                <h2 className="block-title">
                  <Icon name="lock" size={18} /> Locked, awaiting kickoff
                </h2>
                <span className="muted small">Published calls for upcoming matches</span>
              </div>
              <div className="grid grid--2">
                {data.pending.map((c) => (
                  <CallCard key={c.id} call={c} showMatch linkToMatch />
                ))}
              </div>
            </section>
          )}

          <section className="tr-section">
            <div className="block-head">
              <h2 className="block-title">
                <Icon name="ledger" size={18} /> The full record
              </h2>
              <span className="muted small">{filtered.length} calls</span>
            </div>
            <div className="ledger-filters">
              <select value={league} onChange={(e) => setLeague(e.target.value)} aria-label="Competition">
                <option value="all">All competitions</option>
                {leagues.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <select value={conviction} onChange={(e) => setConviction(e.target.value as typeof conviction)} aria-label="Conviction">
                <option value="all">Any conviction</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select value={outcome} onChange={(e) => setOutcome(e.target.value as typeof outcome)} aria-label="Outcome">
                <option value="all">Any outcome</option>
                <option>Correct</option>
                <option>Missed</option>
                <option>Void</option>
              </select>
            </div>
            <Card className="table-card">
              <div className="table-scroll">
                <table className="table ledger">
                  <thead>
                    <tr>
                      <th>Record</th>
                      <th>Match</th>
                      <th>Published</th>
                      <th>Call</th>
                      <th className="hide-sm">Conviction</th>
                      <th>Result</th>
                      <th>Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAll ? filtered : filtered.slice(0, 12)).map((c) => (
                      <tr key={c.id}>
                        <td className="mono small nowrap">
                          {c.id}
                          <div className="ledger__fp" title={`Fingerprint ${c.fingerprint}`}>
                            <Icon name="fingerprint" size={11} /> {c.fingerprint.slice(0, 8)}
                          </div>
                        </td>
                        <td>
                          <div className="strong nowrap">
                            {c.home} vs {c.away}
                          </div>
                          <div className="muted small">{c.competition}</div>
                        </td>
                        <td className="small">
                          <div className="nowrap">{formatDateTime(c.publishedAt)}</div>
                          <div className="muted nowrap">
                            <Icon name="lock" size={11} /> {leadTime(c.publishedAt, c.kickoff)} before KO
                          </div>
                        </td>
                        <td className="ledger__call">
                          <div className="strong">{c.call}</div>
                          <div className="muted small hide-sm">{c.analyst.name}</div>
                        </td>
                        <td className="hide-sm">
                          <ConvictionMeter value={c.conviction} />
                        </td>
                        <td className="mono nowrap">{c.finalScore ?? '—'}</td>
                        <td>
                          <OutcomeBadge outcome={c.outcome} />
                          {c.voidReason && <div className="muted small">{c.voidReason}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            {filtered.length > 12 && (
              <button className="chip ledger-more" onClick={() => setShowAll((v) => !v)}>
                {showAll ? 'Show fewer' : `Show all ${filtered.length} calls`}
              </button>
            )}
          </section>

          <Card className={cx('card--pad', 'tr-principles')}>
            <h3>What the record measures — and what it doesn't</h3>
            <p className="muted">
              The Track Record measures whether an analyst's read of the match was right. Vision X1 does not publish odds, returns, profit
              figures or staking advice, and past accuracy does not guarantee future results. 18+.
            </p>
            <Link to="/matches" className="link-inline">
              Read today's match pages <Icon name="arrowRight" size={14} />
            </Link>
          </Card>
        </>
      )}
    </div>
  );
}
