/**
 * Domain model for Vision X1.
 *
 * These types are the contract between the UI and any data provider.
 * The mock provider satisfies them today; a real sports-data provider
 * (Opta, Sportmonks, API-Football, StatsBomb, …) should be adapted to
 * them in src/services/providers/ rather than leaking vendor shapes into
 * components.
 */

export type ResultCode = 'W' | 'D' | 'L';
export type Side = 'home' | 'away';

export interface Competition {
  id: string;
  name: string;
  shortName: string;
  country: string;
}

export interface VenueSplit {
  played: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
}

export interface SeasonStats {
  played: number;
  position: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  xgFor: number;
  xgAgainst: number;
  possession: number;
  shotsPerGame: number;
  shotsOnTargetPerGame: number;
  cleanSheets: number;
  bttsRate: number;
  over25Rate: number;
  home: VenueSplit;
  away: VenueSplit;
}

export interface RecentResult {
  opponent: string;
  venue: 'H' | 'A';
  score: string; // from this team's perspective, e.g. "3-1"
  result: ResultCode;
  competition: string;
  date: string; // ISO date
  xgFor: number;
  xgAgainst: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  city: string;
  competitionId: string;
  venue: string;
  colors: [string, string];
  season: SeasonStats;
  recent: RecentResult[];
}

export type MatchStatus = 'scheduled' | 'live' | 'finished';

/** Which of the three match-page layers are published for a fixture. */
export interface Coverage {
  data: true; // every fixture has the data layer
  ai: boolean;
  expert: boolean;
}

export interface Match {
  id: string;
  competition: Competition;
  home: Team;
  away: Team;
  kickoff: string; // ISO datetime
  venue: string;
  round: string;
  status: MatchStatus;
  score?: { home: number; away: number };
  featured: boolean;
  tags: string[];
  headline: string;
  coverage: Coverage;
  call?: VisionCall; // the locked Vision X1 call, if one was published
}

export interface HeadToHead {
  date: string;
  competition: string;
  homeTeamId: string;
  awayTeamId: string;
  score: { home: number; away: number };
  note?: string;
}

export interface StatComparison {
  label: string;
  home: number;
  away: number;
  format?: 'number' | 'percent' | 'decimal';
  higherIsBetter?: boolean;
}

export interface Signal {
  label: string;
  detail: string;
  lean: Side | 'neutral';
  strength: 1 | 2 | 3; // 1 = weak, 3 = strong
}

export interface AiAnalysis {
  id: string;
  matchId: string;
  headline: string;
  summary: string;
  signals: Signal[];
  dataCoverage: string[];
  generatedAt: string;
  modelLabel: string;
}

export interface Analyst {
  name: string;
  role: string;
  initials: string;
}

export type Conviction = 'Low' | 'Medium' | 'High';

export interface ExpertInsight {
  id: string;
  matchId: string;
  analyst: Analyst;
  title: string;
  excerpt: string;
  body: string[];
  conviction: Conviction;
  angle: string;
  publishedAt: string;
  tags: string[];
}

export interface Risk {
  title: string;
  detail: string;
  severity: 'low' | 'medium' | 'high';
}

export type CallOutcome = 'Pending' | 'Correct' | 'Missed' | 'Void';

/**
 * A Vision X1 call: the analyst's headline read, published before kickoff.
 * Once published it is append-only — `publishedAt` and `fingerprint` never
 * change, and the outcome is graded automatically after full time.
 */
export interface VisionCall {
  id: string; // public record ID, e.g. VX1-26-0412
  matchId?: string; // set when the fixture exists in the match dataset
  competition: string;
  home: string;
  away: string;
  kickoff: string;
  publishedAt: string;
  analyst: Analyst;
  call: string; // e.g. "PSG win"
  rationale: string;
  conviction: Conviction;
  outcome: CallOutcome;
  finalScore?: string;
  voidReason?: string;
  fingerprint: string; // content hash recorded at publication (demo)
}

export interface MatchData {
  stats: StatComparison[];
  extraStats: StatComparison[];
  h2h: HeadToHead[];
  goalTiming?: { buckets: string[]; home: number[]; away: number[] };
  keyAbsences: { teamId: string; player: string; status: string }[];
  updatedAt: string;
}

/** Everything a Match Page shows, split into the three product layers. */
export interface MatchDetail {
  match: Match;
  data: MatchData; // layer 01
  ai?: AiAnalysis; // layer 02
  expert?: ExpertInsight; // layer 03
  call?: VisionCall; // layer 03 — the locked call
  risks: Risk[];
}

export interface ReadingEntry {
  id: string;
  call: VisionCall;
  openedAt: string;
}

export interface AlertPref {
  id: string;
  label: string;
  detail: string;
  on: boolean;
}

export interface CompanionNotification {
  id: string;
  kind: 'lineup' | 'insight' | 'alert' | 'digest';
  title: string;
  body: string;
  minutesAgo: number;
  matchId?: string;
}

export interface DemoUser {
  name: string;
  initials: string;
  plan: 'Free' | 'Pro' | 'Elite';
  memberSince: string;
  telegramLinked: boolean;
  savedMatchIds: string[];
  favouriteTeamIds: string[];
}
