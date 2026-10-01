import { Link } from 'react-router-dom';
import type { Match } from '../../types/football';
import { cx, formatDay, formatKickoff } from '../../utils';
import { useAppState } from '../../hooks/AppState';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/primitives';
import { FormStrip } from './FormStrip';
import { TeamCrest } from './TeamCrest';

function Status({ match }: { match: Match }) {
  if (match.status === 'live')
    return (
      <span className="match-status match-status--live">
        <span className="live-dot" /> Live {match.score && `${match.score.home}–${match.score.away}`}
      </span>
    );
  if (match.status === 'finished' && match.score)
    return <span className="match-status">FT {match.score.home}–{match.score.away}</span>;
  return (
    <span className="match-status">
      {formatDay(match.kickoff) !== 'Today' && `${formatDay(match.kickoff)} · `}
      {formatKickoff(match.kickoff)}
    </span>
  );
}

export function SaveButton({ matchId, compact }: { matchId: string; compact?: boolean }) {
  const { isSaved, toggleSaved } = useAppState();
  const saved = isSaved(matchId);
  return (
    <button
      type="button"
      className={cx('icon-btn', saved && 'is-active')}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved matches' : 'Save match'}
      title={saved ? 'Saved' : 'Save match'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(matchId);
      }}
    >
      <Icon name="bookmark" size={compact ? 15 : 17} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}

/** Card variant: used in grids on Home / Dashboard. */
export function MatchCard({ match }: { match: Match }) {
  return (
    <Link to={`/match/${match.id}`} className="card card--interactive match-card">
      <div className="match-card__top">
        <span className="match-card__comp">{match.competition.name}</span>
        <Status match={match} />
      </div>
      {(['home', 'away'] as const).map((side) => {
        const t = match[side];
        return (
          <div key={side} className="match-card__team">
            <TeamCrest team={t} size={30} />
            <span className="match-card__name">{t.shortName}</span>
            <FormStrip results={t.recent.slice(0, 5)} size="sm" />
          </div>
        );
      })}
      <p className="match-card__headline">{match.headline}</p>
      <div className="match-card__foot">
        <div className="match-card__tags">
          {match.hasFullReport && <Badge tone="ai" icon="spark">Full report</Badge>}
          {match.tags.slice(0, match.hasFullReport ? 1 : 2).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <SaveButton matchId={match.id} compact />
      </div>
    </Link>
  );
}

/** Row variant: used in compact lists (dashboard fixture list). */
export function MatchRow({ match, active }: { match: Match; active?: boolean }) {
  return (
    <Link to={`/match/${match.id}`} className={cx('match-row', active && 'is-active')}>
      <span className="match-row__time">
        {match.status === 'live' ? (
          <span className="match-status--live">
            <span className="live-dot" /> {match.score?.home}–{match.score?.away}
          </span>
        ) : (
          formatKickoff(match.kickoff)
        )}
      </span>
      <span className="match-row__teams">
        <span className="match-row__team">
          <TeamCrest team={match.home} size={22} /> {match.home.shortName}
        </span>
        <span className="match-row__team">
          <TeamCrest team={match.away} size={22} /> {match.away.shortName}
        </span>
      </span>
      <span className="match-row__comp">{match.competition.shortName}</span>
      {match.hasFullReport ? <Icon name="spark" size={15} className="match-row__ai" /> : <span />}
      <SaveButton matchId={match.id} compact />
    </Link>
  );
}
