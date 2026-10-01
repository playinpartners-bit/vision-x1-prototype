import type { ExpertInsight, Match, Risk, Signal } from '../../types/football';
import { cx, formatDateTime } from '../../utils';
import { Icon } from '../ui/Icon';
import { Avatar, StrengthDots } from '../ui/primitives';

const strengthLabel = { 1: 'Weak', 2: 'Moderate', 3: 'Strong' } as const;

export function SignalList({ signals, match, compact }: { signals: Signal[]; match?: Match; compact?: boolean }) {
  const leanLabel = (s: Signal) =>
    s.lean === 'neutral' ? 'Neutral' : match ? `Favours ${match[s.lean].shortName}` : s.lean === 'home' ? 'Favours home' : 'Favours away';
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

/** The analyst's written opinion (layer 03, alongside the locked call). */
export function ExpertArticle({ insight }: { insight: ExpertInsight }) {
  return (
    <article className="card expert-article">
      <div className="expert-article__by">
        <Avatar initials={insight.analyst.initials} size={44} />
        <div>
          <div className="expert-article__name">{insight.analyst.name}</div>
          <div className="expert-article__role">{insight.analyst.role}</div>
        </div>
        <span className="expert-article__time">
          <Icon name="clock" size={13} /> {formatDateTime(insight.publishedAt)}
        </span>
      </div>
      <h3 className="expert-article__title">{insight.title}</h3>
      <p className="expert-article__excerpt">{insight.excerpt}</p>
      {insight.body.map((p, i) => (
        <p key={i} className="expert-article__para">
          {p}
        </p>
      ))}
      <div className="expert-article__foot">
        <span>
          Angle: <strong>{insight.angle}</strong>
        </span>
        {insight.tags.map((t) => (
          <span key={t} className="tag-soft">
            {t}
          </span>
        ))}
      </div>
    </article>
  );
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
