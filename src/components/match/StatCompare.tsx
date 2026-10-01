import type { StatComparison } from '../../types/football';
import { cx, formatStat } from '../../utils';

/**
 * Mirrored bar comparison. The "leading" side is emphasised; colours are
 * team-neutral (home = accent, away = secondary) — no green/red judgement.
 */
export function StatCompare({ stats, homeLabel, awayLabel }: { stats: StatComparison[]; homeLabel: string; awayLabel: string }) {
  return (
    <div className="stat-compare">
      <div className="stat-compare__legend">
        <span className="legend legend--home">{homeLabel}</span>
        <span className="legend legend--away">{awayLabel}</span>
      </div>
      {stats.map((s) => {
        // For "lower is better" stats, invert so the longer bar is always the stronger side.
        const w = (v: number) => (s.higherIsBetter === false ? 1 / Math.max(v, 0.01) : v);
        const total = w(s.home) + w(s.away) || 1;
        const better = s.higherIsBetter === false ? (s.home < s.away ? 'home' : s.away < s.home ? 'away' : null) : s.home > s.away ? 'home' : s.away > s.home ? 'away' : null;
        return (
          <div key={s.label} className="stat-row">
            <span className={cx('stat-row__val', better === 'home' && 'is-lead')}>{formatStat(s.home, s.format)}</span>
            <div className="stat-row__mid">
              <span className="stat-row__label">{s.label}</span>
              <div className="stat-row__bars">
                <span className="stat-row__bar stat-row__bar--home" style={{ width: `${(w(s.home) / total) * 100}%` }} />
                <span className="stat-row__bar stat-row__bar--away" style={{ width: `${(w(s.away) / total) * 100}%` }} />
              </div>
            </div>
            <span className={cx('stat-row__val', 'stat-row__val--away', better === 'away' && 'is-lead')}>{formatStat(s.away, s.format)}</span>
          </div>
        );
      })}
    </div>
  );
}
