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
  hasFullReport: boolean;
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

/** Illustrative output only. Must always be rendered with a DEMO label. */
export interface DemoOutlook {
  home: [number, number];
  draw: [number, number];
  away: [number, number];
  note: string;
}

export interface MatchIntel {
  matchId: string;
  h2h: HeadToHead[];
  goalTiming: { buckets: string[]; home: number[]; away: number[] };
  extraStats: StatComparison[];
  aiSummary: AiAnalysis;
  expert: ExpertInsight;
  risks: Risk[];
  outlook: DemoOutlook;
  keyAbsences: { teamId: string; player: string; status: string }[];
}

export interface MatchDetail {
  match: Match;
  stats: StatComparison[];
  intel?: MatchIntel; // only some fixtures have a full analyst report
}

export type HistoryOutcome = 'Read aligned' | 'Read not aligned' | 'Pending';

export interface HistoryEntry {
  id: string;
  matchLabel: string;
  competition: string;
  date: string;
  type: 'AI analysis' | 'Expert insight' | 'Assistant session';
  title: string;
  outcome: HistoryOutcome;
  finalScore?: string;
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
