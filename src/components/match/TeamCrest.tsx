import type { Team } from '../../types/football';

/**
 * Neutral generated crest (team colours + code). Deliberately not a club
 * logo — real crests require licensing and should come from the data
 * provider's media feed later.
 */
export function TeamCrest({ team, size = 40 }: { team: Pick<Team, 'code' | 'colors' | 'name'>; size?: number }) {
  const [primary, secondary] = team.colors;
  const id = `crest-${team.code}-${size}`;
  const fontSize = team.code.length > 3 ? 7.5 : 9;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label={team.name} className="crest">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={primary} />
          <stop offset="1" stopColor={primary} stopOpacity="0.78" />
        </linearGradient>
      </defs>
      <path d="M20 2.5 35 7v12.5c0 9-6.5 15.5-15 18-8.5-2.5-15-9-15-18V7z" fill={`url(#${id})`} />
      <path d="M20 2.5 35 7v12.5c0 9-6.5 15.5-15 18-8.5-2.5-15-9-15-18V7z" fill="none" stroke={secondary} strokeOpacity="0.55" strokeWidth="1.4" />
      <path d="M8 26.5h24" stroke={secondary} strokeOpacity="0.5" strokeWidth="1.2" />
      <text x="20" y="21.5" textAnchor="middle" fontSize={fontSize} fontWeight="700" fill="#fff" fontFamily="Space Grotesk, Inter, sans-serif" letterSpacing="0.4">
        {team.code}
      </text>
    </svg>
  );
}
