import { Link } from 'react-router-dom';
import type { AiAnalysis, ExpertInsight, Match, Risk, Signal } from '../../types/football';
import { cx } from '../../utils';
import { Icon } from '../ui/Icon';
import { Avatar, Badge, DemoTag, StrengthDots } from '../ui/primitives';

const strengthLabel = { 1: 'Weak', 2: 'Moderate', 3: 'Strong' } as const;

export function SignalList({ signals, match, compact }: { signals: Signal[]; match?: Match; compact?: boolean }) {
  const leanLabel = (s: Signal) =>
    s.lean === 'neutral' ? 'Neutral' : match ? `Leans ${match[s.lean].shortName}` : s.lean === 'home' ? 'Leans home' : 'Leans away';
  return (
    <ul className={cx('signals', compact && 'signals--compact')}>
      {signals.map((s) => (
        <li key={s.label} className="signal">
          <span className={cx('signal__lean', `signal__lean--${s.lean}`)} aria-hidden="true" />
          <div className="signal__body">
            <div className="signal__head">
              <span className="signal__label">{s.label}</span>
              <span className="signal__meta">
                <span className={cx('lean-tag', `lean-tag--${s.lean}`)}>{leanLabel(s)}</span>
                <StrengthDots value={s.strength} />
                <span className="sr-only">{strengthLabel[s.strength]}</span>
              </span>
            </div>
            {!compact && <p className="signal__detail">{s.detail}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AiAnalysisCard({ analysis, match, compact }: { analysis: AiAnalysis; match?: Match; compact?: boolean }) {
  const body = (
    <>
      <div className="ai-card__top">
        <Badge tone="ai" icon="spark">AI analysis</Badge>
        <DemoTag label="Demo" />
      </div>
      {match && (
        <div className="ai-card__match">
          {match.home.shortName} <span>vs</span> {match.away.shortName}
          <span className="ai-card__comp">· {match.competition.name}</span>
        </div>
      )}
      <h3 className="ai-card__headline">{analysis.headline}</h3>
      {!compact && <p className="ai-card__summary">{analysis.summary}</p>}
      <SignalList signals={analysis.signals.slice(0, compact ? 2 : 3)} match={match} compact />
      <div className="ai-card__foot">
        <span>{analysis.modelLabel}</span>
        {match && (
          <span className="link-inline">
            Open <Icon name="arrowRight" size={14} />
          </span>
        )}
      </div>
    </>
  );
  return match ? (
    <Link to={`/match/${match.id}`} className="card card--interactive ai-card">
      {body}
    </Link>
  ) : (
    <div className="card ai-card">{body}</div>
  );
}

const convictionLevel = { Low: 1, Medium: 2, High: 3 } as const;

export function ExpertCard({ insight, match, expanded }: { insight: ExpertInsight; match?: Match; expanded?: boolean }) {
  const inner = (
    <>
      <div className="expert-card__top">
        <Avatar initials={insight.analyst.initials} size={40} />
        <div>
          <div className="expert-card__name">{insight.analyst.name}</div>
          <div className="expert-card__role">{insight.analyst.role}</div>
        </div>
        <Badge tone="accent" icon="shield">Vision X1 Expert</Badge>
      </div>
      {match && (
        <div className="expert-card__match">
          {match.home.shortName} vs {match.away.shortName} · {match.competition.name}
        </div>
      )}
      <h3 className="expert-card__title">{insight.title}</h3>
      <p className="expert-card__excerpt">{insight.excerpt}</p>
      {expanded && insight.body.map((p, i) => <p key={i} className="expert-card__para">{p}</p>)}
      <div className="expert-card__foot">
        <span className="expert-card__meta">
          Angle: <strong>{insight.angle}</strong>
        </span>
        <span className="expert-card__meta">
          Analyst conviction <StrengthDots value={convictionLevel[insight.conviction]} /> <strong>{insight.conviction}</strong>
        </span>
      </div>
    </>
  );
  if (match && !expanded)
    return (
      <Link to={`/match/${match.id}`} className="card card--interactive expert-card">
        {inner}
      </Link>
    );
  return <article className="card expert-card">{inner}</article>;
}

export function RiskList({ risks }: { risks: Risk[] }) {
  return (
    <ul className="risks">
      {risks.map((r) => (
        <li key={r.title} className={cx('risk', `risk--${r.severity}`)}>
          <span className="risk__icon">
            <Icon name={r.severity === 'low' ? 'info' : 'alert'} size={16} />
          </span>
          <div>
            <div className="risk__head">
              <span className="risk__title">{r.title}</span>
              <span className="risk__sev">{r.severity} impact</span>
            </div>
            <p className="risk__detail">{r.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
