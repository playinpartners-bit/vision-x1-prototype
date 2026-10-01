/**
 * Hero visual: an abstract pitch with data overlays. Purely decorative —
 * communicates "football + data" without stock imagery.
 */
export function PitchVisual() {
  const shots = [
    [612, 118, 0.42], [640, 160, 0.18], [590, 180, 0.08], [655, 206, 0.61], [600, 238, 0.12],
    [632, 262, 0.27], [570, 150, 0.05], [585, 270, 0.07], [662, 186, 0.33],
  ];
  return (
    <svg className="pitch-visual" viewBox="0 0 720 380" aria-hidden="true">
      <defs>
        <linearGradient id="pv-fade" x1="0" x2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="pv-glow" cx="0.75" cy="0.5" r="0.6">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="20" y="20" width="680" height="340" rx="14" className="pv-line" fill="url(#pv-glow)" />
      <line x1="360" y1="20" x2="360" y2="360" className="pv-line" />
      <circle cx="360" cy="190" r="56" className="pv-line" fill="none" />
      <circle cx="360" cy="190" r="3" className="pv-dot" />
      <rect x="20" y="105" width="96" height="170" className="pv-line" fill="none" />
      <rect x="604" y="105" width="96" height="170" className="pv-line" fill="none" />
      <rect x="20" y="148" width="34" height="84" className="pv-line" fill="none" />
      <rect x="666" y="148" width="34" height="84" className="pv-line" fill="none" />
      {/* passing network */}
      <g className="pv-net">
        <path d="M150 250 L250 200 L330 260 L420 180 L500 220 L560 150" />
        <path d="M250 200 L300 120 L420 180" />
        <path d="M330 260 L460 300 L500 220" />
      </g>
      {[[150, 250], [250, 200], [330, 260], [420, 180], [500, 220], [560, 150], [300, 120], [460, 300]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 3 ? 7 : 5} className="pv-node" />
      ))}
      {/* shot map, sized by xG */}
      {shots.map(([x, y, xg], i) => (
        <circle key={i} cx={x} cy={y} r={4 + xg * 16} className="pv-shot" style={{ animationDelay: `${i * 0.25}s` }} />
      ))}
      <path d="M420 180 Q 540 120 655 206" stroke="url(#pv-fade)" strokeWidth="2.5" fill="none" strokeDasharray="5 6" />
    </svg>
  );
}
