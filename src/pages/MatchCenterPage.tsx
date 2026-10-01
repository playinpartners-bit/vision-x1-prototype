import { useState } from 'react';
import { Link } from 'react-router-dom';
import { football } from '../services';
import { useAsync } from '../hooks/useAsync';
import { Icon } from '../components/ui/Icon';
import { Badge, CardSkeleton, DemoTag } from '../components/ui/primitives';
import { TeamCrest } from '../components/match/TeamCrest';
import { FormStrip } from '../components/match/FormStrip';
import { SaveButton } from '../components/match/MatchCard';
import { CoveragePills, LayerTag } from '../components/layers/Layers';
import { ConvictionMeter } from '../components/trust/Trust';
import type { Match } from '../types/football';
import { cx, formatDateTime, formatKickoff, leadTime } from '../utils';

function FixtureRow({ match }: { match: Match }) {
  return (
    <Link to={`/match/${match.id}`} className={cx('fixture', match.featured && 'fixture--featured')}>
      <div className="fixture__time">
        {match.status === 'live' ? (
          <span className="match-status--live">
            <span className="live-dot" /> {match.score?.home}–{match.score?.away}
          </span>
        ) : (
          <span className="mono">{formatKickoff(match.kickoff)}</span>
        )}
        <span className="fixture__comp">{match.competition.name}</span>
      </div>
      <div className="fixture__teams">
        {(['home', 'away'] as const).map((s) => (
          <div key={s} className="fixture__team">
            <TeamCrest team={match[s]} size={28} />
            <span className="fixture__name">{match[s].shortName}</span>
            <FormStrip results={match[s].recent} size="sm" />
          </div>
        ))}
      </div>
      <div className="fixture__layers">
        <CoveragePills coverage={match.coverage} />
        <p className="fixture__headline">{match.headline}</p>
      </div>
      <div className="fixture__call">
        {match.call ? (
          <>
            <span className="fixture__call-label">
              <Icon name="lock" size={12} /> Vision X1 View · {leadTime(match.call.publishedAt, match.kickoff)} before KO
            </span>
            <strong>{match.call.view}</strong>
            <ConvictionMeter value={match.call.conviction} />
          </>
        ) : (
          <span className="muted small">No Vision X1 View</span>
        )}
      </div>
      <div className="fixture__end">
        <SaveButton matchId={match.id} compact />
        <Icon name="chevronRight" size={18} />
      </div>
    </Link>
  );
}

export function MatchCenterPage() {
  const [day, setDay] = useState(0);
  const [comp, setComp] = useState<string>('all');
  const { data, loading } = useAsync(() => football.getMatches(day), [day]);
  const comps = Array.from(new Set((data ?? []).map((m) => m.competition.name)));
  const list = (data ?? []).filter((m) => comp === 'all' || m.competition.name === comp);
  const featured = data?.find((m) => m.featured);

  return (
    <div className="container page">
      <header className="page-head">
        <div>
          <span className="eyebrow">Match Center</span>
          <h1 className="page-title">Every match page, in one place</h1>
          <p className="muted page-lede">
            Each fixture opens a match page with up to three layers: data, an AI summary and a Vision X1 expert opinion. Vision X1 Views are
            locked the moment they're published.
          </p>
        </div>
        <DemoTag label="Demo fixtures" />
      </header>

      <div className="mc-toolbar">
        <div className="seg-control" role="tablist">
          {['Today', 'Tomorrow'].map((l, i) => (
            <button key={l} role="tab" aria-selected={day === i} className={cx(day === i && 'is-active')} onClick={() => { setDay(i); setComp('all'); }}>
              {l}
            </button>
          ))}
        </div>
        <div className="chip-row">
          <button className={cx('chip', comp === 'all' && 'chip--active')} onClick={() => setComp('all')}>
            All competitions
          </button>
          {comps.map((c) => (
            <button key={c} className={cx('chip', comp === c && 'chip--active')} onClick={() => setComp(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="mc-legend">
          <LayerTag layer="data" size="sm" />
          <LayerTag layer="ai" size="sm" />
          <LayerTag layer="expert" size="sm" />
          <span className="muted small">= layers published</span>
        </div>
      </div>

      {featured && comp === 'all' && (
        <Link to={`/match/${featured.id}`} className="mc-featured card card--interactive">
          <div className="mc-featured__left">
            <Badge tone="accent">Featured match page</Badge>
            <div className="mc-featured__teams">
              <TeamCrest team={featured.home} size={48} />
              <div>
                <h2>
                  {featured.home.shortName} vs {featured.away.shortName}
                </h2>
                <span className="muted small">
                  {featured.competition.name} · {formatKickoff(featured.kickoff)} · {featured.venue}
                </span>
              </div>
              <TeamCrest team={featured.away} size={48} />
            </div>
            <p className="muted">{featured.headline}</p>
          </div>
          <div className="mc-featured__right">
            <CoveragePills coverage={featured.coverage} />
            {featured.call && (
              <span className="stamp stamp--compact">
                <Icon name="lock" size={13} /> Call published {formatDateTime(featured.call.publishedAt)}
              </span>
            )}
            <span className="link-inline">
              Open match page <Icon name="arrowRight" size={14} />
            </span>
          </div>
        </Link>
      )}

      <div className="fixture-list">
        {loading
          ? [0, 1, 2].map((i) => <CardSkeleton key={i} lines={2} />)
          : list.map((m) => <FixtureRow key={m.id} match={m} />)}
      </div>
      <p className="muted small mc-note">
        Vision X1 doesn't show odds, bookmaker links or staking information. Match pages are for understanding the game.
      </p>
    </div>
  );
}
