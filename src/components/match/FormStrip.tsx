import type { RecentResult, ResultCode } from '../../types/football';
import { cx } from '../../utils';

export function FormPill({ r, title }: { r: ResultCode; title?: string }) {
  return (
    <span className={cx('form-pill', `form-pill--${r}`)} title={title}>
      {r}
    </span>
  );
}

/** Most recent result first. */
export function FormStrip({ results, size = 'md' }: { results: (RecentResult | ResultCode)[]; size?: 'sm' | 'md' }) {
  return (
    <span className={cx('form-strip', size === 'sm' && 'form-strip--sm')} aria-label="Recent form, most recent first">
      {results.map((r, i) =>
        typeof r === 'string' ? (
          <FormPill key={i} r={r} />
        ) : (
          <FormPill key={i} r={r.result} title={`${r.venue === 'H' ? 'vs' : '@'} ${r.opponent} ${r.score} (${r.competition})`} />
        ),
      )}
    </span>
  );
}
