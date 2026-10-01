import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackRecord } from '../services';
import { useAsync } from '../hooks/useAsync';
import { Icon, type IconName } from '../components/ui/Icon';
import { Card, CardSkeleton, DemoTag } from '../components/ui/primitives';
import { CallCard, ConvictionMeter, OutcomeBadge, RecordStrip, recordSummary } from '../components/trust/Trust';
import type { CallOutcome, Conviction, VisionCall } from '../types/football';
import { formatDateTime, leadTime } from '../utils';

const steps: { icon: IconName; title: string; body: string }[] = [
  { icon: 'shield', title: 'Published before kickoff', body: 'An analyst publishes a Vision X1 View with a conviction level and rationale. Publishing closes at kickoff.' },
  { icon: 'fingerprint', title: 'Timestamped & locked', body: 'The View is written to an append-only record with a timestamp and a content fingerprint. It cannot be edited or deleted.' },
  { icon: 'ledger', title: 'Kept in public', body: 'Every View stays in this record after full time — including the reads that did not hold. Postponed matches are marked void.' },
];

function Breakdown({ title, rows }: { title: string; rows: { label: string; correct: number; decided: number }[] }) {
  return (
    <div className="perf-breakdown">
      <h4 className="side-label">{title}</h4>
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
    </div>
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
  const pending = data?.pending ?? [];
  const s = recordSummary(graded, pending);
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
  const example = pending[0];

  return (
    <div className="container page">
      <header className="page-head">
        <div>
          <span className="eyebrow">Public Track Record</span>
          <h1 className="page-title">Accountability first. Performance second.</h1>
          <p className="muted page-lede">
            Every Vision X1 View is timestamped before kickoff, fingerprinted and locked. It can’t be edited after publication, and it
            stays here whatever happens on the pitch. How the Views have read the game is reported further down, with its methodology.
          </p>
        </div>
        <DemoTag label="Demo record" />
      </header>

      {loading ? (
        <CardSkeleton lines={4} />
      ) : (
        <>
          {/* ───── PRIMARY: ACCOUNTABILITY ───── */}
          <section aria-labelledby="acc-title">
            <h2 id="acc-title" className="sr-only">Accountability</h2>
            <div className="kpis kpis--record">
              <Card className="kpi-tile kpi-tile--acc">
                <Icon name="ledger" size={18} />
                <span className="kpi-tile__value">{s.published}</span>
                <span className="kpi-tile__label">Analyses published</span>
              </Card>
              <Card className="kpi-tile kpi-tile--acc">
                <Icon name="clock" size={18} />
                <span className="kpi-tile__value">{Math.round(s.beforeKickoffPct * 100)}%</span>
                <span className="kpi-tile__label">Timestamped before kickoff</span>
              </Card>
              <Card className="kpi-tile kpi-tile--acc">
                <Icon name="lock" size={18} />
                <span className="kpi-tile__value">{s.editsAfterPublication}</span>
                <span className="kpi-tile__label">Edits after publication</span>
              </Card>
              <Card className="kpi-tile kpi-tile--acc">
                <Icon name="fingerprint" size={18} />
                <span className="kpi-tile__value">{s.medianLeadHours.toFixed(1)} h</span>
                <span className="kpi-tile__label">Median publication lead time</span>
              </Card>
            </div>
            <p className="muted small kpi-note">
              Includes {pending.length} Views locked for upcoming matches. <DemoTag label="Demo data" />
            </p>
          </section>

          <section className="how">
            {steps.map((st, i) => (
              <div key={st.title} className="how__step">
                <span className="how__n">{i + 1}</span>
                <span className="feature__icon">
                  <Icon name={st.icon} size={20} />
                </span>
                <h3>{st.title}</h3>
                <p>{st.body}</p>
              </div>
            ))}
          </section>

          {pending.length > 0 && (
            <section className="tr-section">
              <div className="block-head">
                <h2 className="block-title">
                  <Icon name="lock" size={18} /> Locked, awaiting kickoff
                </h2>
                <span className="muted small">Vision X1 Views published for upcoming matches</span>
              </div>
              <div className="grid grid--2">
                {pending.map((c) => (
                  <CallCard key={c.id} call={c} showMatch linkToMatch />
                ))}
              </div>
            </section>
          )}

          <section className="tr-section">
            <div className="block-head">
              <h2 className="block-title">
                <Icon name="ledger" size={18} /> Publication record
              </h2>
              <span className="muted small">{filtered.length} graded Views</span>
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
              <select value={outcome} onChange={(e) => setOutcome(e.target.value as typeof outcome)} aria-label="Status">
                <option value="all">Any status</option>
                <option value="Correct">Read held</option>
                <option value="Missed">Read missed</option>
                <option value="Void">Void</option>
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
                      <th>Vision X1 View</th>
                      <th className="hide-sm">Conviction</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAll ? filtered : filtered.slice(0, 10)).map((c) => (
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
                          <div className="ledger__lead nowrap">
                            <Icon name="lock" size={11} /> {leadTime(c.publishedAt, c.kickoff)} before KO
                          </div>
                        </td>
                        <td className="ledger__call">
                          <div>{c.view}</div>
                          <div className="muted small hide-sm">{c.analyst.name}</div>
                        </td>
                        <td className="hide-sm">
                          <ConvictionMeter value={c.conviction} />
                        </td>
                        <td title={`Grading criterion fixed at publication: ${c.grading}`}>
                          <OutcomeBadge outcome={c.outcome} />
                          <div className="muted small mono">{c.finalScore ? `FT ${c.finalScore}` : c.voidReason}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            {filtered.length > 10 && (
              <button className="chip ledger-more" onClick={() => setShowAll((v) => !v)}>
                {showAll ? 'Show fewer' : `Show all ${filtered.length} Views`}
              </button>
            )}
          </section>

          {/* ───── SECONDARY: PERFORMANCE ───── */}
          <section className="tr-section perf">
            <div className="perf__divider">
              <span>Secondary · Performance</span>
            </div>
            <div className="block-head">
              <h2 className="block-title">How the Views have read the game</h2>
              <DemoTag label="Demo data" />
            </div>
            <div className="perf__grid">
              <Card className="card--pad perf__method">
                <h3 className="sub-title" style={{ marginTop: 0 }}>Methodology</h3>
                <ol className="method-list">
                  <li>
                    <strong>One criterion, fixed at publication.</strong> When a View is published it is paired with a single gradable
                    criterion, locked with the View.
                    {example && (
                      <span className="method-example">
                        “{example.view}” → <em>{example.grading}</em>
                      </span>
                    )}
                  </li>
                  <li>
                    <strong>Graded automatically after full time</strong> against the official 90-minute result. Nobody re-scores a View.
                  </li>
                  <li>
                    <strong>Voids are excluded.</strong> Postponed or abandoned matches are marked void and left out of the rate.
                  </li>
                  <li>
                    <strong>Rate = reads held ÷ (held + missed).</strong> Conviction is declared before kickoff, so results can be split by it.
                  </li>
                  <li>
                    <strong>Context, not a promise.</strong> {s.decided} graded Views is a small sample. Past reads don’t predict future
                    results, and Vision X1 publishes no odds, returns or staking figures.
                  </li>
                </ol>
              </Card>
              <Card className="card--pad perf__stats">
                <div className="perf__headline">
                  <span className="perf__rate">{Math.round(s.rate * 100)}%</span>
                  <span className="muted small">
                    of graded Views held ({s.correct} of {s.decided}) · {s.voids} void
                  </span>
                </div>
                <RecordStrip calls={[...graded].reverse()} />
                <div className="strip-axis muted small">
                  <span>Older</span>
                  <span>Most recent</span>
                </div>
                <Breakdown title="By declared conviction" rows={group(graded, (c) => c.conviction, ['High', 'Medium', 'Low'])} />
                <Breakdown title="By competition" rows={group(graded, (c) => c.competition)} />
              </Card>
            </div>
          </section>

          <Card className="card--pad tr-principles">
            <h3>Why accountability comes first</h3>
            <p className="muted">
              Anyone can claim a good run of form. What Vision X1 can prove is how it publishes: before kickoff, with a timestamp, without
              edits, and in public. That is what this page is for. 18+.
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
