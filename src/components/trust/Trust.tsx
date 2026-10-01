import { Link } from 'react-router-dom';
import type { CallOutcome, Conviction, VisionCall } from '../../types/football';
import { cx, formatDateTime, leadTime } from '../../utils';
import { Icon } from '../ui/Icon';
import { Avatar, DemoTag, StrengthDots } from '../ui/primitives';

const convictionLevel: Record<Conviction, number> = { Low: 1, Medium: 2, High: 3 };

export function ConvictionMeter({ value }: { value: Conviction }) {
  return (
    <span className="conviction">
      <StrengthDots value={convictionLevel[value]} />
      <span>{value} conviction</span>
    </span>
  );
}

/** Grading status of a View. Neutral wording: a read held or it didn't. */
export function OutcomeBadge({ outcome }: { outcome: CallOutcome }) {
  const label = { Pending: 'Pending', Correct: 'Read held', Missed: 'Read missed', Void: 'Void' }[outcome];
  return <span className={cx('outcome-badge', `outcome-badge--${outcome.toLowerCase()}`)}>{label}</span>;
}

/** The timestamp + lock line. The core trust primitive of the product. */
export function PublicationStamp({ call, compact }: { call: VisionCall; compact?: boolean }) {
  if (compact)
    return (
      <span className="stamp stamp--compact" title={`Record ${call.id} · fingerprint ${call.fingerprint}`}>
        <Icon name="lock" size={13} /> Published {formatDateTime(call.publishedAt)} · {leadTime(call.publishedAt, call.kickoff)} before kickoff
      </span>
    );
  return (
    <div className="stamp">
      <div className="stamp__row">
        <Icon name="lock" size={15} />
        <span>
          <strong>Published {formatDateTime(call.publishedAt)}</strong> · {leadTime(call.publishedAt, call.kickoff)} before kickoff
        </span>
      </div>
      <div className="stamp__row stamp__row--meta">
        <span>Record {call.id}</span>
        <span className="stamp__fp">
          <Icon name="fingerprint" size={13} /> {call.fingerprint.slice(0, 12)}…
        </span>
        <span>Locked · cannot be edited</span>
        <DemoTag label="Demo record" />
      </div>
    </div>
  );
}

/** The Vision X1 View — the analyst's headline read, as locked at publication. */
export function CallCard({ call, showMatch, linkToMatch }: { call: VisionCall; showMatch?: boolean; linkToMatch?: boolean }) {
  const body = (
    <>
      <div className="call-card__top">
        <span className="call-card__label">
          <Icon name="shield" size={14} /> Vision X1 View
        </span>
        <OutcomeBadge outcome={call.outcome} />
      </div>
      {showMatch && (
        <div className="call-card__match">
          {call.home} vs {call.away} <span>· {call.competition}</span>
        </div>
      )}
      <div className="call-card__call">{call.view}</div>
      <p className="call-card__why">{call.rationale}</p>
      <div className="call-card__row">
        <span className="call-card__analyst">
          <Avatar initials={call.analyst.initials} size={26} /> {call.analyst.name}
        </span>
        <ConvictionMeter value={call.conviction} />
      </div>
      <PublicationStamp call={call} />
    </>
  );
  if (linkToMatch && call.matchId)
    return (
      <Link to={`/match/${call.matchId}`} className="card card--interactive call-card">
        {body}
      </Link>
    );
  return <div className="card call-card">{body}</div>;
}

/** Dot strip of recent graded calls, oldest → newest. */
export function RecordStrip({ calls }: { calls: VisionCall[] }) {
  return (
    <div className="record-strip" aria-label="Recent graded calls, oldest to newest">
      {calls.map((c) => (
        <span
          key={c.id}
          className={cx('record-strip__dot', `record-strip__dot--${c.outcome.toLowerCase()}`)}
          title={`${c.id} · ${c.home} vs ${c.away} · ${c.view} · ${c.outcome}${c.finalScore ? ` (${c.finalScore})` : ''}`}
        />
      ))}
    </div>
  );
}

/**
 * Track Record figures. Accountability metrics come first (they describe how
 * Views are published); accuracy is computed separately as secondary context.
 */
export function recordSummary(graded: VisionCall[], pending: VisionCall[] = []) {
  const all = [...graded, ...pending];
  const beforeKickoff = all.filter((c) => new Date(c.publishedAt).getTime() < new Date(c.kickoff).getTime()).length;
  const decided = graded.filter((c) => c.outcome === 'Correct' || c.outcome === 'Missed');
  const correct = decided.filter((c) => c.outcome === 'Correct').length;
  const leads = all.map((c) => (new Date(c.kickoff).getTime() - new Date(c.publishedAt).getTime()) / 3_600_000).sort((a, b) => a - b);
  const median = leads.length ? leads[Math.floor(leads.length / 2)] : 0;
  return {
    // accountability
    published: all.length,
    beforeKickoffPct: all.length ? beforeKickoff / all.length : 0,
    editsAfterPublication: 0,
    medianLeadHours: median,
    // performance (secondary)
    total: graded.length,
    decided: decided.length,
    correct,
    rate: decided.length ? correct / decided.length : 0,
    voids: graded.filter((c) => c.outcome === 'Void').length,
  };
}
