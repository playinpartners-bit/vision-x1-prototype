import { Link } from 'react-router-dom';
import type { Match } from '../../types/football';
import { cx, formatDay, formatKickoff } from '../../utils';
import { useAppState } from '../../hooks/AppState';
import { Icon } from '../ui/Icon';
import { CoveragePills } from '../layers/Layers';
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
      <div className="match-card__call">
        {match.call ? (
          <>
            <Icon name="lock" size={13} />
            <span>
              Expert call published <strong>{formatKickoff(match.call.publishedAt)}</strong>
            </span>
          </>
        ) : (
          <span className="muted">No expert call on this fixture</span>
        )}
      </div>
      <div className="match-card__foot">
        <CoveragePills coverage={match.coverage} />
        <SaveButton matchId={match.id} compact />
      </div>
    </Link>
  );
}
