import { Link } from 'react-router-dom';
import type { MatchDetail } from '../../types/football';
import { formatDateTime, formatKickoff, leadTime } from '../../utils';
import { Icon } from '../ui/Icon';
import { DemoTag } from '../ui/primitives';
import { LayerTag } from '../layers/Layers';
import { ConvictionMeter } from '../trust/Trust';
import { TeamCrest } from '../match/TeamCrest';

/** Hero visual: a match page shown as its three stacked layers. */
export function MatchPageStack({ d }: { d: MatchDetail }) {
  const { match, data, ai, call } = d;
  const xg = data.stats.find((s) => s.label.startsWith('Expected goals'))!;
  const ppg = data.stats.find((s) => s.label === 'Points per game')!;
  return (
    <Link to={`/match/${match.id}`} className="stack-visual" aria-label={`Open the ${match.home.shortName} vs ${match.away.shortName} match page`}>
      <div className="stack-visual__head">
        <TeamCrest team={match.home} size={36} />
        <div className="stack-visual__title">
          <strong>
            {match.home.shortName} vs {match.away.shortName}
          </strong>
          <span>
            {match.competition.name} · Kickoff {formatKickoff(match.kickoff)}
          </span>
        </div>
        <TeamCrest team={match.away} size={36} />
      </div>

      <div className="sv-layer sv-layer--data">
        <div className="sv-layer__top">
          <LayerTag layer="data" size="sm" />
          <DemoTag label="Demo" />
        </div>
        <div className="sv-bars">
          {[xg, ppg].map((s) => (
            <div key={s.label} className="sv-bar">
              <span className="mono">{s.home}</span>
              <div className="sv-bar__track">
                <span className="sv-bar__h" style={{ flex: s.home }} />
                <span className="sv-bar__a" style={{ flex: s.away }} />
              </div>
              <span className="mono">{s.away}</span>
              <span className="sv-bar__label">{s.label.replace('Expected goals (xG) / game', 'xG per game')}</span>
            </div>
          ))}
        </div>
      </div>

      {ai && (
        <div className="sv-layer sv-layer--ai">
          <div className="sv-layer__top">
            <LayerTag layer="ai" size="sm" />
            <span className="sv-time">{formatDateTime(ai.generatedAt)}</span>
          </div>
          <p>{ai.headline}</p>
        </div>
      )}

      {call && (
        <div className="sv-layer sv-layer--expert">
          <div className="sv-layer__top">
            <LayerTag layer="expert" size="sm" />
            <span className="sv-lock">
              <Icon name="lock" size={12} /> Locked
            </span>
          </div>
          <div className="sv-call">
            <strong>{call.call}</strong>
            <ConvictionMeter value={call.conviction} />
          </div>
          <span className="sv-time">
            {call.analyst.name} · published {leadTime(call.publishedAt, call.kickoff)} before kickoff
          </span>
        </div>
      )}
    </Link>
  );
}
