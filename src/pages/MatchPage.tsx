import { Link, useParams } from 'react-router-dom';
import { football } from '../services';
import { useAsync } from '../hooks/useAsync';
import { track } from '../analytics/track';
import { TELEGRAM_URL } from '../config';
import { Icon } from '../components/ui/Icon';
import { Badge, Button, Card, CardSkeleton, DemoTag } from '../components/ui/primitives';
import { TeamCrest } from '../components/match/TeamCrest';
import { StatCompare } from '../components/match/StatCompare';
import { ExpertArticle, RiskList, SignalList } from '../components/match/Insights';
import { GoalsPanel, MatchHeader, RecentTable, profile } from '../components/match/MatchParts';
import { GoalTimingChart, RadarChart } from '../components/charts/Charts';
import { LayerSection, LayerTag, LAYERS, type LayerId } from '../components/layers/Layers';
import { CallCard, ConvictionMeter, OutcomeBadge } from '../components/trust/Trust';
import type { MatchDetail } from '../types/football';
import { cx, formatDateTime, formatDay, leadTime, minutesSince } from '../utils';

const sections: { id: string; label: string; layer?: LayerId }[] = [
  { id: 'layer-data', label: 'Data', layer: 'data' },
  { id: 'layer-ai', label: 'AI Summary', layer: 'ai' },
  { id: 'layer-expert', label: 'Expert Opinion', layer: 'expert' },
  { id: 'risks', label: 'Key Risks' },
  { id: 'record', label: 'Publication record' },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** At-a-glance: one column per layer, so the separation is visible before scrolling. */
function LayerOverview({ d }: { d: MatchDetail }) {
  const { match, data, ai, call } = d;
  const keyStats = data.stats.filter((s) => ['Points per game', 'Expected goals (xG) / game', 'Goals conceded / game'].includes(s.label));
  return (
    <div className="overview3">
      <button className="ov ov--data" onClick={() => scrollTo('layer-data')}>
        <div className="ov__head">
          <LayerTag layer="data" />
          <DemoTag label="Demo" />
        </div>
        <div className="ov__stats">
          {keyStats.map((s) => (
            <div key={s.label} className="ov__stat">
              <span className="ov__stat-label">{s.label.replace(' / game', '/g').replace('Expected goals (xG)', 'xG')}</span>
              <span className="ov__stat-vals">
                <strong>{s.home}</strong>
                <span className="muted">vs</span>
                <strong>{s.away}</strong>
              </span>
            </div>
          ))}
        </div>
        <span className="ov__foot">Updated {minutesSince(data.updatedAt)} min ago</span>
      </button>

      <button className="ov ov--ai" onClick={() => scrollTo('layer-ai')}>
        <div className="ov__head">
          <LayerTag layer="ai" />
        </div>
        {ai ? (
          <>
            <p className="ov__text">{ai.headline}</p>
            <span className="ov__foot">Generated {formatDateTime(ai.generatedAt)}</span>
          </>
        ) : (
          <p className="ov__empty">No AI summary for this fixture yet.</p>
        )}
      </button>

      <button className="ov ov--expert" onClick={() => scrollTo('layer-expert')}>
        <div className="ov__head">
          <LayerTag layer="expert" size="sm" />
          {call && <OutcomeBadge outcome={call.outcome} />}
        </div>
        {call ? (
          <>
            <div className="ov__call">{call.view}</div>
            <ConvictionMeter value={call.conviction} />
            <span className="ov__foot">
              <Icon name="lock" size={12} /> Locked {formatDateTime(call.publishedAt)} · {call.analyst.name}
            </span>
          </>
        ) : (
          <p className="ov__empty">No Vision X1 View on {match.home.shortName} vs {match.away.shortName}.</p>
        )}
      </button>
    </div>
  );
}

export function MatchPage() {
  const { matchId = 'psg-marseille' } = useParams();
  const { data: d, loading } = useAsync(() => football.getMatchDetail(matchId), [matchId]);

  if (loading)
    return (
      <div className="container page">
        <CardSkeleton lines={6} />
      </div>
    );
  if (!d)
    return (
      <div className="container page empty">
        <h1 className="page-title">Match not found</h1>
        <p className="muted">This fixture isn't in the demo dataset.</p>
        <Button to="/matches">Back to Match Center</Button>
      </div>
    );

  const { match, data, ai, expert, call, risks } = d;
  const H = match.home.shortName;
  const A = match.away.shortName;

  const h2h = data.h2h.reduce(
    (acc, g) => {
      const hg = g.homeTeamId === match.home.id ? g.score.home : g.score.away;
      const ag = g.homeTeamId === match.home.id ? g.score.away : g.score.home;
      acc[hg > ag ? 'home' : hg < ag ? 'away' : 'draw']++;
      acc.goals += g.score.home + g.score.away;
      return acc;
    },
    { home: 0, draw: 0, away: 0, goals: 0 },
  );

  return (
    <>
      <MatchHeader match={match} />

      <nav className="subnav" aria-label="Match page sections">
        <div className="container subnav__inner">
          {sections.map((s) => (
            <button key={s.id} className={cx('subnav__item', s.layer && `subnav__item--${s.layer}`)} onClick={() => scrollTo(s.id)}>
              {s.layer && <span className="subnav__n">{LAYERS[s.layer].n}</span>}
              {s.label}
            </button>
          ))}
          <Link to={`/assistant?match=${match.id}`} className="subnav__cta">
            <Icon name="spark" size={14} /> Ask <span className="pill-preview">Preview</span>
          </Link>
        </div>
      </nav>

      <div className="container page page--match">
        <LayerOverview d={d} />

        {/* ───────────── 01 DATA ───────────── */}
        <LayerSection
          layer="data"
          id="layer-data"
          meta={
            <>
              <DemoTag />
              <span className="layer__stamp">
                <Icon name="clock" size={13} /> Updated {minutesSince(data.updatedAt)} min ago
              </span>
            </>
          }
        >
          <h3 className="layer__sub">Recent form</h3>
          <div className="grid grid--2">
            <RecentTable team={match.home} />
            <RecentTable team={match.away} />
          </div>

          <h3 className="layer__sub">Goals</h3>
          <GoalsPanel match={match} />
          {data.goalTiming && (
            <Card className="card--pad">
              <div className="block-head">
                <h4 className="sub-title" style={{ margin: 0 }}>When goals are scored</h4>
                <span className="muted small">Goals by 15-minute interval, league</span>
              </div>
              <GoalTimingChart {...data.goalTiming} homeLabel={H} awayLabel={A} />
            </Card>
          )}

          <h3 className="layer__sub">Team statistics</h3>
          <div className="stats-grid">
            <Card className="card--pad">
              <StatCompare stats={[...data.stats, ...data.extraStats]} homeLabel={H} awayLabel={A} />
            </Card>
            <Card className="card--pad">
              <h4 className="sub-title" style={{ marginTop: 0 }}>Team profile</h4>
              <RadarChart
                axes={['Attack', 'Defence', 'Possession', 'Shot volume', 'Clean sheets', 'Points']}
                home={profile(match.home)}
                away={profile(match.away)}
                homeLabel={H}
                awayLabel={A}
              />
              <p className="muted small">Normalised against top-5-league benchmarks (demo scale).</p>
            </Card>
          </div>

          {data.h2h.length > 0 && (
            <>
              <h3 className="layer__sub">Head-to-head · last {data.h2h.length}</h3>
              <div className="h2h-grid">
                <Card className="card--pad h2h-summary">
                  <div className="h2h-summary__row">
                    <div>
                      <span className="big-num">{h2h.home}</span>
                      <span className="muted small">{H} wins</span>
                    </div>
                    <div>
                      <span className="big-num">{h2h.draw}</span>
                      <span className="muted small">Draws</span>
                    </div>
                    <div>
                      <span className="big-num">{h2h.away}</span>
                      <span className="muted small">{A} wins</span>
                    </div>
                  </div>
                  <div className="h2h-summary__bar">
                    <span className="seg--home" style={{ flex: h2h.home }} />
                    <span className="seg--draw" style={{ flex: h2h.draw }} />
                    <span className="seg--away" style={{ flex: h2h.away }} />
                  </div>
                  <p className="muted small">{(h2h.goals / data.h2h.length).toFixed(1)} goals per game on average.</p>
                </Card>
                <Card className="h2h-list">
                  {data.h2h.map((g, i) => {
                    const ht = g.homeTeamId === match.home.id ? match.home : match.away;
                    const at = g.homeTeamId === match.home.id ? match.away : match.home;
                    return (
                      <div key={i} className="h2h-item">
                        <span className="muted small h2h-item__date">{formatDay(g.date)}</span>
                        <span className="h2h-item__team h2h-item__team--home">
                          {ht.shortName} <TeamCrest team={ht} size={20} />
                        </span>
                        <span className="h2h-item__score mono">
                          {g.score.home} – {g.score.away}
                        </span>
                        <span className="h2h-item__team">
                          <TeamCrest team={at} size={20} /> {at.shortName}
                        </span>
                        <span className="muted small h2h-item__note">{g.note ?? g.competition}</span>
                      </div>
                    );
                  })}
                </Card>
              </div>
            </>
          )}

          {data.keyAbsences.length > 0 && (
            <>
              <h3 className="layer__sub">Availability</h3>
              <Card className="card--pad">
                <ul className="absences">
                  {data.keyAbsences.map((k) => (
                    <li key={k.player}>
                      <TeamCrest team={k.teamId === match.home.id ? match.home : match.away} size={22} />
                      <span>{k.player}</span>
                      <Badge tone={k.status.includes('test') ? 'caution' : 'neutral'}>{k.status}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          )}
        </LayerSection>

        {/* ───────────── 02 AI SUMMARY ───────────── */}
        <LayerSection
          layer="ai"
          id="layer-ai"
          meta={
            ai && (
              <span className="layer__stamp">
                <Icon name="clock" size={13} /> Generated {formatDateTime(ai.generatedAt)} · {ai.modelLabel}
              </span>
            )
          }
        >
          {ai ? (
            <Card className="card--pad ai-summary">
              <h3 className="ai-summary__headline">{ai.headline}</h3>
              <p className="ai-summary__text">{ai.summary}</p>
              <h4 className="sub-title">Signals the summary is built on</h4>
              <SignalList signals={ai.signals} match={match} />
              <div className="ai-summary__coverage">
                <span className="muted small">Inputs from layer 01:</span>
                {ai.dataCoverage.map((c) => (
                  <Badge key={c} tone="outline">
                    {c}
                  </Badge>
                ))}
              </div>
              <p className="callout">
                <Icon name="info" size={15} /> Generated automatically from the data layer only. It is not edited by analysts and is not the
                Vision X1 View. AI output can be wrong.
              </p>
            </Card>
          ) : (
            <Card className="card--pad layer-empty">The AI summary is generated once enough data is available for this fixture.</Card>
          )}
        </LayerSection>

        {/* ───────────── 03 EXPERT OPINION ───────────── */}
        <LayerSection
          layer="expert"
          id="layer-expert"
          meta={
            call && (
              <span className="layer__stamp layer__stamp--lock">
                <Icon name="lock" size={13} /> Locked {leadTime(call.publishedAt, call.kickoff)} before kickoff
              </span>
            )
          }
        >
          {call || expert ? (
            <div className="expert-grid">
              {call && <CallCard call={call} />}
              {expert && <ExpertArticle insight={expert} />}
            </div>
          ) : (
            <Card className="card--pad layer-empty">
              <strong>No Vision X1 View on this fixture.</strong> Vision X1 analysts only publish where they have a view — we would rather
              stay silent than fill the page.{' '}
              <Link to="/match/psg-marseille" className="link-inline">
                See a full match page <Icon name="arrowRight" size={13} />
              </Link>
            </Card>
          )}
        </LayerSection>

        {/* ───────────── RISKS ───────────── */}
        <section id="risks" className="risks-section">
          <header className="risks-section__head">
            <span className="risks-section__icon">
              <Icon name="alert" size={18} />
            </span>
            <div>
              <h2>Key risks & uncertainties</h2>
              <p className="muted">What could make any read of this match wrong. Shown on every match page.</p>
            </div>
          </header>
          {risks.length ? (
            <RiskList risks={risks} />
          ) : (
            <p className="muted small">Risk assessment is published alongside the expert opinion. For now: small samples and unconfirmed line-ups apply to every fixture.</p>
          )}
        </section>

        {/* ───────────── PUBLICATION RECORD ───────────── */}
        <section id="record" className="pub-record card">
          <div className="pub-record__head">
            <h2>
              <Icon name="ledger" size={18} /> Publication record
            </h2>
            <DemoTag label="Demo timestamps" />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Layer</th>
                <th>Source</th>
                <th>Timestamp</th>
                <th className="hide-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><LayerTag layer="data" size="sm" /></td>
                <td>Match & event data feed</td>
                <td className="mono small">{formatDateTime(data.updatedAt)}</td>
                <td className="hide-sm muted">Live — refreshes until kickoff</td>
              </tr>
              <tr>
                <td><LayerTag layer="ai" size="sm" /></td>
                <td>{ai ? ai.modelLabel : '—'}</td>
                <td className="mono small">{ai ? formatDateTime(ai.generatedAt) : '—'}</td>
                <td className="hide-sm muted">{ai ? 'Generated · regenerates if data changes' : 'Not generated'}</td>
              </tr>
              <tr>
                <td><LayerTag layer="expert" size="sm" /></td>
                <td>{call ? call.analyst.name : expert ? expert.analyst.name : '—'}</td>
                <td className="mono small">{call ? formatDateTime(call.publishedAt) : '—'}</td>
                <td className="hide-sm">
                  {call ? (
                    <span className="lock-status">
                      <Icon name="lock" size={13} /> Locked · {call.id}
                    </span>
                  ) : (
                    <span className="muted">No View published</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="muted small">Kickoff</td>
                <td>{match.venue}</td>
                <td className="mono small">{formatDateTime(match.kickoff)}</td>
                <td className="hide-sm muted">View graded automatically after full time</td>
              </tr>
            </tbody>
          </table>
          <p className="muted small pub-record__note">
            Vision X1 Views are written to an append-only record when published. They cannot be edited or deleted, and every one — right or wrong —
            appears in the <Link to="/track-record">public Track Record</Link>.
          </p>
        </section>

        {/* ───────────── CTA ───────────── */}
        <Card className="deep-cta">
          <div>
            <Badge tone="accent" icon="pocket">Vision X1 in your pocket</Badge>
            <h2>Follow this match</h2>
            <p className="muted">
              Save it to My Vision X1 and get a Telegram alert when line-ups are confirmed or the expert updates the risk picture.
            </p>
          </div>
          <div className="deep-cta__btns">
            <Button size="lg" icon="bookmark" to="/me">
              Open My Vision X1
            </Button>
            <Button
              size="lg"
              variant="secondary"
              icon="telegram"
              href={TELEGRAM_URL}
              onClick={() => track('telegram_open', { placement: 'match_follow', match_id: match.id, destination: TELEGRAM_URL })}
            >
              Get Telegram alerts (demo)
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
