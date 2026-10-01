import { Link, useParams } from 'react-router-dom';
import { football } from '../services';
import { useAsync } from '../hooks/useAsync';
import { Icon } from '../components/ui/Icon';
import { Badge, Button, Card, CardSkeleton, DemoTag } from '../components/ui/primitives';
import { TeamCrest } from '../components/match/TeamCrest';
import { FormPill, FormStrip } from '../components/match/FormStrip';
import { SaveButton } from '../components/match/MatchCard';
import { StatCompare } from '../components/match/StatCompare';
import { ExpertCard, RiskList, SignalList } from '../components/match/Insights';
import { GoalTimingChart, OutlookBar, RadarChart, XgTrend } from '../components/charts/Charts';
import type { Match, Team } from '../types/football';
import { formatDay, formatKickoff } from '../utils';

const clamp = (v: number) => Math.max(0, Math.min(1, v));

function profile(t: Team) {
  const s = t.season;
  return [
    clamp(s.xgFor / s.played / 2.6),
    clamp(1 - s.xgAgainst / s.played / 2),
    clamp((s.possession - 35) / 35),
    clamp(s.shotsPerGame / 19),
    clamp(s.cleanSheets / s.played / 0.6),
    clamp(s.points / s.played / 3),
  ];
}

const sections = [
  ['overview', 'Overview'],
  ['form', 'Form'],
  ['goals', 'Goals'],
  ['stats', 'Team stats'],
  ['h2h', 'Head-to-head'],
  ['expert', 'Expert'],
  ['risks', 'Risks'],
] as const;

function MatchHeader({ match }: { match: Match }) {
  return (
    <section className="mh">
      <div className="mh__bg" />
      <div className="container">
        <div className="mh__top">
          <Link to="/dashboard" className="back-link">
            <Icon name="arrowRight" size={14} style={{ transform: 'rotate(180deg)' }} /> Dashboard
          </Link>
          <div className="mh__actions">
            <DemoTag label="Demo fixture" />
            <SaveButton matchId={match.id} />
          </div>
        </div>
        <div className="mh__meta">
          <Badge tone="outline">{match.competition.name}</Badge>
          <span>{match.round}</span>
          <span>·</span>
          <span>{match.venue}</span>
        </div>
        <div className="mh__teams">
          {(['home', 'away'] as const).map((side) => {
            const t = match[side];
            return (
              <div key={side} className={`mh__team mh__team--${side}`}>
                <TeamCrest team={t} size={84} />
                <div className="mh__name">{t.name}</div>
                <div className="mh__pos">
                  {ordinal(t.season.position)} · {t.season.points} pts
                </div>
                <FormStrip results={t.recent} />
              </div>
            );
          })}
          <div className="mh__center">
            {match.status === 'live' && match.score ? (
              <>
                <span className="mh__score">
                  {match.score.home} – {match.score.away}
                </span>
                <span className="match-status--live">
                  <span className="live-dot" /> Live (demo)
                </span>
              </>
            ) : (
              <>
                <span className="mh__time">{formatKickoff(match.kickoff)}</span>
                <span className="muted">{formatDay(match.kickoff)}</span>
              </>
            )}
          </div>
        </div>
        <div className="mh__tags">
          {match.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function RecentTable({ team }: { team: Team }) {
  const chrono = [...team.recent].reverse();
  return (
    <Card className="card--pad">
      <div className="form-card__head">
        <TeamCrest team={team} size={32} />
        <div>
          <strong>{team.shortName}</strong>
          <div className="muted small">Last 5 · all competitions</div>
        </div>
        <FormStrip results={team.recent} size="sm" />
      </div>
      <table className="table table--compact">
        <tbody>
          {team.recent.map((r, i) => (
            <tr key={i}>
              <td className="muted small nowrap hide-sm">{formatDay(r.date)}</td>
              <td>
                <span className="muted">{r.venue === 'H' ? 'vs' : '@'}</span> {r.opponent}
                {r.competition.includes('Champions') && <span className="comp-tag">UCL</span>}
              </td>
              <td className="mono nowrap">{r.score}</td>
              <td className="mono muted small nowrap">
                {r.xgFor.toFixed(1)}–{r.xgAgainst.toFixed(1)} xG
              </td>
              <td>
                <FormPill r={r.result} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <XgTrend xgFor={chrono.map((r) => r.xgFor)} xgAgainst={chrono.map((r) => r.xgAgainst)} labels={chrono.map((r) => r.opponent.slice(0, 3).toUpperCase())} />
    </Card>
  );
}

function GoalsPanel({ match }: { match: Match }) {
  const h = match.home.season;
  const a = match.away.season;
  const rows = [
    { label: `${match.home.shortName} at home`, split: h.home, team: match.home },
    { label: `${match.away.shortName} away`, split: a.away, team: match.away },
  ];
  return (
    <div className="goals-grid">
      {rows.map(({ label, split, team }) => (
        <Card key={label} className="card--pad goals-card">
          <div className="goals-card__head">
            <TeamCrest team={team} size={26} />
            <strong>{label}</strong>
          </div>
          <div className="goals-card__stats">
            <div>
              <span className="big-num">{(split.gf / split.played).toFixed(2)}</span>
              <span className="muted small">scored / game</span>
            </div>
            <div>
              <span className="big-num">{(split.ga / split.played).toFixed(2)}</span>
              <span className="muted small">conceded / game</span>
            </div>
            <div>
              <span className="big-num">
                {split.w}-{split.d}-{split.l}
              </span>
              <span className="muted small">W-D-L</span>
            </div>
          </div>
          <div className="rate-rows">
            {[
              ['Both teams scored', team.season.bttsRate],
              ['3+ goals in match', team.season.over25Rate],
              ['Clean sheet rate', team.season.cleanSheets / team.season.played],
            ].map(([l, v]) => (
              <div key={l as string} className="rate-row">
                <span>{l}</span>
                <div className="rate-row__track">
                  <span style={{ width: `${(v as number) * 100}%` }} />
                </div>
                <strong className="mono">{Math.round((v as number) * 100)}%</strong>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function MatchDetailPage() {
  const { matchId = 'psg-marseille' } = useParams();
  const { data, loading } = useAsync(() => football.getMatchDetail(matchId), [matchId]);

  if (loading)
    return (
      <div className="container page">
        <CardSkeleton lines={6} />
      </div>
    );
  if (!data)
    return (
      <div className="container page empty">
        <h1 className="page-title">Match not found</h1>
        <p className="muted">This fixture isn't in the demo dataset.</p>
        <Button to="/dashboard">Back to dashboard</Button>
      </div>
    );

  const { match, stats, intel } = data;
  const H = match.home.shortName;
  const A = match.away.shortName;

  const h2hSummary = intel
    ? intel.h2h.reduce(
        (acc, g) => {
          const homeGoals = g.homeTeamId === match.home.id ? g.score.home : g.score.away;
          const awayGoals = g.homeTeamId === match.home.id ? g.score.away : g.score.home;
          if (homeGoals > awayGoals) acc.home++;
          else if (homeGoals < awayGoals) acc.away++;
          else acc.draw++;
          acc.goals += g.score.home + g.score.away;
          return acc;
        },
        { home: 0, draw: 0, away: 0, goals: 0 },
      )
    : null;

  return (
    <>
      <MatchHeader match={match} />

      <nav className="subnav" aria-label="Match sections">
        <div className="container subnav__inner">
          {sections
            .filter(([id]) => intel || !['h2h', 'expert', 'risks'].includes(id))
            .map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}>
                {label}
              </a>
            ))}
          <Link to={`/assistant?match=${match.id}`} className="subnav__cta">
            <Icon name="spark" size={14} /> Ask the assistant
          </Link>
        </div>
      </nav>

      <div className="container page page--match">
        {/* OVERVIEW */}
        <section id="overview" className="md-section">
          {intel ? (
            <div className="overview-grid">
              <Card className="card--pad ai-summary">
                <div className="ai-summary__head">
                  <Badge tone="ai" icon="spark">AI-assisted match summary</Badge>
                  <DemoTag />
                </div>
                <h2 className="ai-summary__headline">{intel.aiSummary.headline}</h2>
                <p className="ai-summary__text">{intel.aiSummary.summary}</p>
                <h3 className="sub-title">Key signals</h3>
                <SignalList signals={intel.aiSummary.signals} match={match} />
                <div className="ai-summary__coverage">
                  <span className="muted small">Data considered:</span>
                  {intel.aiSummary.dataCoverage.map((d) => (
                    <Badge key={d} tone="outline">{d}</Badge>
                  ))}
                </div>
                <p className="muted small">
                  {intel.aiSummary.modelLabel} · AI output can be wrong. It summarises evidence; it does not predict results.
                </p>
              </Card>
              <div className="stack">
                <Card className="card--pad outlook-card">
                  <div className="ai-summary__head">
                    <h3 className="sub-title" style={{ margin: 0 }}>Model outlook</h3>
                    <DemoTag label="Demo values" />
                  </div>
                  <OutlookBar
                    segments={[
                      { label: H, range: intel.outlook.home, tone: 'home' },
                      { label: 'Draw', range: intel.outlook.draw, tone: 'draw' },
                      { label: A, range: intel.outlook.away, tone: 'away' },
                    ]}
                  />
                  <p className="callout callout--caution">
                    <Icon name="info" size={15} /> {intel.outlook.note}
                  </p>
                </Card>
                <Card className="card--pad">
                  <h3 className="sub-title">Availability</h3>
                  <ul className="absences">
                    {intel.keyAbsences.map((k) => (
                      <li key={k.player}>
                        <TeamCrest team={k.teamId === match.home.id ? match.home : match.away} size={22} />
                        <span>{k.player}</span>
                        <Badge tone={k.status.includes('test') ? 'caution' : 'neutral'}>{k.status}</Badge>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="card--pad cta-card">
                  <h3>Go deeper</h3>
                  <p className="muted small">Ask follow-up questions or get line-up alerts for this match on Telegram.</p>
                  <div className="cta-card__btns">
                    <Button to={`/assistant?match=${match.id}`} icon="spark" size="sm">
                      Ask the AI assistant
                    </Button>
                    <Button variant="secondary" icon="telegram" size="sm">
                      Alert me on Telegram (demo)
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="card--pad no-report">
              <Badge tone="outline" icon="lock">Analyst report not published</Badge>
              <h2>Full intelligence report coming for this fixture</h2>
              <p className="muted">
                In the prototype, the complete AI summary, expert opinion and risk assessment are available for the demo fixture.
                Core statistics below are generated from the demo dataset.
              </p>
              <Button to="/match/psg-marseille" iconRight="arrowRight">
                View the PSG vs Marseille report
              </Button>
            </Card>
          )}
        </section>

        {/* FORM */}
        <section id="form" className="md-section">
          <div className="block-head">
            <h2 className="block-title">Recent form</h2>
            <DemoTag />
          </div>
          <div className="grid grid--2">
            <RecentTable team={match.home} />
            <RecentTable team={match.away} />
          </div>
        </section>

        {/* GOALS */}
        <section id="goals" className="md-section">
          <div className="block-head">
            <h2 className="block-title">Goals data</h2>
            <span className="muted small">League matches this season</span>
          </div>
          <GoalsPanel match={match} />
          {intel && (
            <Card className="card--pad" >
              <div className="block-head">
                <h3 className="sub-title" style={{ margin: 0 }}>When goals are scored</h3>
                <span className="muted small">Goals by 15-minute interval</span>
              </div>
              <GoalTimingChart {...intel.goalTiming} homeLabel={H} awayLabel={A} />
              <p className="muted small">
                Both sides score most heavily after the 75th minute — {H} {intel.goalTiming.home[5]}, {A} {intel.goalTiming.away[5]} — which
                adds to late-game volatility.
              </p>
            </Card>
          )}
        </section>

        {/* STATS */}
        <section id="stats" className="md-section">
          <div className="block-head">
            <h2 className="block-title">Team statistics</h2>
            <DemoTag />
          </div>
          <div className="stats-grid">
            <Card className="card--pad">
              <StatCompare stats={[...stats, ...(intel?.extraStats ?? [])]} homeLabel={H} awayLabel={A} />
            </Card>
            <Card className="card--pad">
              <h3 className="sub-title">Team profile</h3>
              <RadarChart
                axes={['Attack', 'Defence', 'Possession', 'Shot volume', 'Clean sheets', 'Points']}
                home={profile(match.home)}
                away={profile(match.away)}
                homeLabel={H}
                awayLabel={A}
              />
              <p className="muted small">Normalised against Europe's top-5-league benchmarks (demo scale).</p>
            </Card>
          </div>
        </section>

        {intel && h2hSummary && (
          <>
            {/* H2H */}
            <section id="h2h" className="md-section">
              <div className="block-head">
                <h2 className="block-title">Head-to-head</h2>
                <span className="muted small">Last {intel.h2h.length} meetings</span>
              </div>
              <div className="h2h-grid">
                <Card className="card--pad h2h-summary">
                  <div className="h2h-summary__row">
                    <div>
                      <span className="big-num">{h2hSummary.home}</span>
                      <span className="muted small">{H} wins</span>
                    </div>
                    <div>
                      <span className="big-num">{h2hSummary.draw}</span>
                      <span className="muted small">Draws</span>
                    </div>
                    <div>
                      <span className="big-num">{h2hSummary.away}</span>
                      <span className="muted small">{A} wins</span>
                    </div>
                  </div>
                  <div className="h2h-summary__bar">
                    <span className="seg--home" style={{ flex: h2hSummary.home }} />
                    <span className="seg--draw" style={{ flex: h2hSummary.draw }} />
                    <span className="seg--away" style={{ flex: h2hSummary.away }} />
                  </div>
                  <p className="muted small">
                    {(h2hSummary.goals / intel.h2h.length).toFixed(1)} goals per game on average. Past meetings are context, not a
                    forecast — squads and coaches change.
                  </p>
                </Card>
                <Card className="h2h-list">
                  {intel.h2h.map((g, i) => {
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
            </section>

            {/* EXPERT */}
            <section id="expert" className="md-section">
              <div className="block-head">
                <h2 className="block-title">Vision X1 expert opinion</h2>
              </div>
              <ExpertCard insight={intel.expert} expanded />
            </section>

            {/* RISKS */}
            <section id="risks" className="md-section">
              <div className="block-head">
                <h2 className="block-title">Key risks & uncertainties</h2>
                <span className="muted small">What could make any read wrong</span>
              </div>
              <Card className="card--pad">
                <RiskList risks={intel.risks} />
              </Card>
            </section>
          </>
        )}

        {/* CTA */}
        <section className="md-section">
          <Card className="deep-cta">
            <div>
              <Badge tone="ai" icon="spark">Deeper analysis</Badge>
              <h2>Have a question about this match?</h2>
              <p className="muted">
                Ask the Vision X1 assistant to compare players, explore tactical matchups or explain any signal — or get updates the
                moment line-ups drop on Telegram.
              </p>
            </div>
            <div className="deep-cta__btns">
              <Button size="lg" to={`/assistant?match=${match.id}`} icon="spark">
                Ask the assistant
              </Button>
              <Button size="lg" variant="secondary" icon="telegram">
                Follow on Telegram (demo)
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
