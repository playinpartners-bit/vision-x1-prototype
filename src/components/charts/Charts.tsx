/**
 * Lightweight SVG charts — no chart library dependency. Each takes plain
 * numbers so they stay provider-agnostic.
 */
import { useId } from 'react';

/** Mirrored column chart: goals by 15-minute interval. */
export function GoalTimingChart({
  buckets,
  home,
  away,
  homeLabel,
  awayLabel,
}: {
  buckets: string[];
  home: number[];
  away: number[];
  homeLabel: string;
  awayLabel: string;
}) {
  const max = Math.max(...home, ...away, 1);
  const W = 560;
  const H = 200;
  const mid = H / 2;
  const colW = W / buckets.length;
  const barW = Math.min(28, colW * 0.42);
  const scale = (v: number) => (v / max) * (mid - 26);
  return (
    <figure className="chart chart--timing">
      <svg viewBox={`0 0 ${W} ${H + 22}`} role="img" aria-label={`Goals scored by 15-minute interval: ${homeLabel} above, ${awayLabel} below`}>
        <line x1="0" x2={W} y1={mid} y2={mid} className="chart__axis" />
        {[0.5, 1].map((f) => (
          <g key={f}>
            <line x1="0" x2={W} y1={mid - f * (mid - 26)} y2={mid - f * (mid - 26)} className="chart__grid" />
            <line x1="0" x2={W} y1={mid + f * (mid - 26)} y2={mid + f * (mid - 26)} className="chart__grid" />
          </g>
        ))}
        {buckets.map((b, i) => {
          const cx = colW * i + colW / 2;
          const hh = scale(home[i]);
          const ah = scale(away[i]);
          return (
            <g key={b}>
              <rect x={cx - barW / 2} y={mid - hh - 1} width={barW} height={hh} rx="4" className="chart__bar--home" />
              <rect x={cx - barW / 2} y={mid + 1} width={barW} height={ah} rx="4" className="chart__bar--away" />
              <text x={cx} y={mid - hh - 7} textAnchor="middle" className="chart__value">{home[i]}</text>
              <text x={cx} y={mid + ah + 15} textAnchor="middle" className="chart__value">{away[i]}</text>
              <text x={cx} y={H + 18} textAnchor="middle" className="chart__tick">{b}'</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="chart__legend">
        <span className="legend legend--home">{homeLabel} (above)</span>
        <span className="legend legend--away">{awayLabel} (below)</span>
      </figcaption>
    </figure>
  );
}

/** Radar chart comparing two normalised (0–1) team profiles. */
export function RadarChart({
  axes,
  home,
  away,
  homeLabel,
  awayLabel,
}: {
  axes: string[];
  home: number[];
  away: number[];
  homeLabel: string;
  awayLabel: string;
}) {
  const size = 300;
  const c = size / 2;
  const r = c - 52;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    return [c + Math.cos(a) * r * v, c + Math.sin(a) * r * v] as const;
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, Math.max(0.06, v)).join(',')).join(' ');
  return (
    <figure className="chart chart--radar">
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Team profile comparison: ${homeLabel} vs ${awayLabel}`}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon key={f} points={poly(axes.map(() => f))} className="chart__grid" fill="none" />
        ))}
        {axes.map((a, i) => {
          const [x, y] = pt(i, 1);
          const [lx, ly] = pt(i, 1.22);
          return (
            <g key={a}>
              <line x1={c} y1={c} x2={x} y2={y} className="chart__grid" />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="chart__tick">{a}</text>
            </g>
          );
        })}
        <polygon points={poly(away)} className="radar__away" />
        <polygon points={poly(home)} className="radar__home" />
      </svg>
      <figcaption className="chart__legend">
        <span className="legend legend--home">{homeLabel}</span>
        <span className="legend legend--away">{awayLabel}</span>
      </figcaption>
    </figure>
  );
}

/** xG for vs against over recent matches (oldest → newest). */
export function XgTrend({ xgFor, xgAgainst, labels }: { xgFor: number[]; xgAgainst: number[]; labels: string[] }) {
  const gid = useId().replace(/:/g, '');
  const W = 320;
  const H = 110;
  const max = Math.max(...xgFor, ...xgAgainst, 1) * 1.15;
  const x = (i: number) => 14 + (i * (W - 28)) / Math.max(1, xgFor.length - 1);
  const y = (v: number) => H - 18 - (v / max) * (H - 30);
  const line = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  return (
    <figure className="chart chart--xg">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Expected goals for and against, last five matches">
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--home)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--home)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line(xgFor)} L${x(xgFor.length - 1)},${H - 18} L${x(0)},${H - 18}Z`} fill={`url(#${gid})`} />
        <path d={line(xgAgainst)} className="xg__against" />
        <path d={line(xgFor)} className="xg__for" />
        {xgFor.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r="3" className="xg__dot" />
        ))}
        {labels.map((l, i) => (
          <text key={i} x={x(i)} y={H - 3} textAnchor="middle" className="chart__tick">{l}</text>
        ))}
      </svg>
      <figcaption className="chart__legend">
        <span className="legend legend--home">xG for</span>
        <span className="legend legend--muted">xG against</span>
      </figcaption>
    </figure>
  );
}

/** Segmented range bar for the DEMO outlook. Midpoints sized; ranges shown as text. */
export function OutlookBar({
  segments,
}: {
  segments: { label: string; range: [number, number]; tone: 'home' | 'draw' | 'away' }[];
}) {
  const mids = segments.map((s) => (s.range[0] + s.range[1]) / 2);
  const total = mids.reduce((a, b) => a + b, 0);
  return (
    <div className="outlook">
      <div className="outlook__bar">
        {segments.map((s, i) => (
          <span key={s.label} className={`outlook__seg outlook__seg--${s.tone}`} style={{ width: `${(mids[i] / total) * 100}%` }} />
        ))}
      </div>
      <div className="outlook__labels">
        {segments.map((s) => (
          <div key={s.label} className="outlook__label">
            <span className={`legend legend--${s.tone === 'draw' ? 'muted' : s.tone}`}>{s.label}</span>
            <strong>
              {s.range[0]}–{s.range[1]}%
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
