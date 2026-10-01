/** Building blocks of the Match Page's data layer. */
import { Link } from 'react-router-dom';
import type { Match, Team } from '../../types/football';
import { formatDay, formatKickoff } from '../../utils';
import { Icon } from '../ui/Icon';
import { Badge, Card, DemoTag } from '../ui/primitives';
import { XgTrend } from '../charts/Charts';
import { FormPill, FormStrip } from './FormStrip';
import { SaveButton } from './MatchCard';
import { TeamCrest } from './TeamCrest';

export function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/** Normalised 0–1 team profile for the radar chart (demo benchmarks). */
export function profile(t: Team) {
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

export function MatchHeader({ match }: { match: Match }) {
  return (
    <section className="mh">
      <div className="mh__bg" />
      <div className="container">
        <div className="mh__top">
          <Link to="/matches" className="back-link">
            <Icon name="arrowRight" size={14} style={{ transform: 'rotate(180deg)' }} /> Match Center
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
                <span className="muted">{formatDay(match.kickoff)} · Kickoff</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RecentTable({ team }: { team: Team }) {
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

export function GoalsPanel({ match }: { match: Match }) {
  const rows = [
    { label: `${match.home.shortName} at home`, split: match.home.season.home, team: match.home },
    { label: `${match.away.shortName} away`, split: match.away.season.away, team: match.away },
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
            {(
              [
                ['Both teams scored', team.season.bttsRate],
                ['3+ goals in match', team.season.over25Rate],
                ['Clean sheet rate', team.season.cleanSheets / team.season.played],
              ] as const
            ).map(([l, v]) => (
              <div key={l} className="rate-row">
                <span>{l}</span>
                <div className="rate-row__track">
                  <span style={{ width: `${v * 100}%` }} />
                </div>
                <strong className="mono">{Math.round(v * 100)}%</strong>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
