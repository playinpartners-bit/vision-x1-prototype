/**
 * Mock provider — reads the DEMO JSON in src/data/mock and shapes it into
 * the domain model. Times are stored relative to kickoff / today
 * ("dayOffset", "daysAgo", "minutesBeforeKickoff") so the prototype always
 * looks current whenever it is demoed.
 */
import competitionsJson from '../../data/mock/competitions.json';
import teamsJson from '../../data/mock/teams.json';
import matchesJson from '../../data/mock/matches.json';
import aiJson from '../../data/mock/ai-analyses.json';
import insightsJson from '../../data/mock/expert-insights.json';
import callsJson from '../../data/mock/calls.json';
import userJson from '../../data/mock/user.json';
import psgMarseilleIntel from '../../data/mock/match-intel/psg-marseille.json';
import type {
  AiAnalysis,
  AlertPref,
  Analyst,
  Competition,
  CompanionNotification,
  Conviction,
  CallOutcome,
  DemoUser,
  ExpertInsight,
  HeadToHead,
  Match,
  MatchData,
  Risk,
  StatComparison,
  Team,
  VisionCall,
} from '../../types/football';
import type { FootballDataProvider, TrackRecordProvider, UserDataProvider } from '../types';

const LATENCY_MS = 200; // simulate network so loading states are visible

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function dateAt(dayOffset: number, time = '12:00'): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, m, 0, 0);
  return d;
}
const isoAt = (dayOffset: number, time?: string) => dateAt(dayOffset, time).toISOString();
const minutesBefore = (iso: string, minutes: number) => new Date(new Date(iso).getTime() - minutes * 60_000).toISOString();

/** Deterministic demo "fingerprint" standing in for a SHA-256 recorded at publication. */
function fingerprint(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    h1 = Math.imul(h1 ^ input.charCodeAt(i), 16777619);
    h2 = Math.imul(h2 ^ input.charCodeAt(i), 2246822519);
  }
  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  return `${hex(h1)}${hex(h2)}`;
}

// ---------- reference data ----------
const competitions = competitionsJson as Competition[];

type RawTeam = Omit<Team, 'recent' | 'colors'> & {
  colors: string[];
  recent: (Omit<Team['recent'][number], 'date'> & { daysAgo: number })[];
};

const teams: Team[] = (teamsJson as RawTeam[]).map((t) => ({
  ...t,
  colors: [t.colors[0], t.colors[1]] as [string, string],
  recent: t.recent.map(({ daysAgo, ...r }) => ({ ...r, date: isoAt(-daysAgo) })),
}));

const teamById = (id: string): Team => {
  const t = teams.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown team ${id}`);
  return t;
};

// ---------- layer 02 / 03 content ----------
type RawMatch = (typeof matchesJson)[number] & { score?: { home: number; away: number }; risks?: Risk[] };
const rawMatches = matchesJson as RawMatch[];
const kickoffOf = (matchId: string) => {
  const m = rawMatches.find((x) => x.id === matchId)!;
  return isoAt(m.dayOffset, m.time);
};

type Timed<T> = Omit<T, 'generatedAt' | 'publishedAt'> & { minutesBeforeKickoff: number };

const toAi = (a: Timed<AiAnalysis>): AiAnalysis => {
  const { minutesBeforeKickoff, ...rest } = a;
  return { ...rest, generatedAt: minutesBefore(kickoffOf(a.matchId), minutesBeforeKickoff) };
};
const toExpert = (e: Timed<ExpertInsight>): ExpertInsight => {
  const { minutesBeforeKickoff, ...rest } = e;
  return { ...rest, publishedAt: minutesBefore(kickoffOf(e.matchId), minutesBeforeKickoff) };
};

const psgIntel = psgMarseilleIntel;
const aiAnalyses: AiAnalysis[] = [
  toAi(psgIntel.aiSummary as Timed<AiAnalysis>),
  ...(aiJson as Timed<AiAnalysis>[]).map(toAi),
];
const expertInsights: ExpertInsight[] = [
  toExpert(psgIntel.expert as Timed<ExpertInsight>),
  ...(insightsJson as Timed<ExpertInsight>[]).map(toExpert),
];

// ---------- calls (track record) ----------
interface RawCall {
  id: string;
  matchId?: string;
  competition?: string;
  home?: string;
  away?: string;
  kickoffDaysAgo?: number;
  kickoffTime?: string;
  minutesBeforeKickoff: number;
  analyst: Analyst;
  view: string;
  rationale: string;
  grading: string;
  conviction: string;
  outcome: string;
  finalScore?: string | null;
  voidReason?: string;
}

function toCall(c: RawCall): VisionCall {
  let base: Pick<VisionCall, 'competition' | 'home' | 'away' | 'kickoff'>;
  if (c.matchId) {
    const m = rawMatches.find((x) => x.id === c.matchId)!;
    base = {
      competition: competitions.find((x) => x.id === m.competitionId)!.name,
      home: teamById(m.homeTeamId).shortName,
      away: teamById(m.awayTeamId).shortName,
      kickoff: isoAt(m.dayOffset, m.time),
    };
  } else {
    base = { competition: c.competition!, home: c.home!, away: c.away!, kickoff: isoAt(-c.kickoffDaysAgo!, c.kickoffTime) };
  }
  const publishedAt = minutesBefore(base.kickoff, c.minutesBeforeKickoff);
  return {
    id: c.id,
    matchId: c.matchId,
    ...base,
    publishedAt,
    analyst: c.analyst,
    view: c.view,
    rationale: c.rationale,
    grading: c.grading,
    conviction: c.conviction as Conviction,
    outcome: c.outcome as CallOutcome,
    finalScore: c.finalScore ?? undefined,
    voidReason: c.voidReason,
    fingerprint: fingerprint(`${c.id}|${publishedAt.slice(0, 16)}|${c.view}|${c.grading}|${c.analyst.name}`),
  };
}

const pendingCalls = (callsJson.pending as RawCall[]).map(toCall);
const gradedCalls = (callsJson.graded as RawCall[]).map(toCall);

// ---------- matches ----------
const matches: Match[] = rawMatches.map((m) => {
  const home = teamById(m.homeTeamId);
  return {
    id: m.id,
    competition: competitions.find((c) => c.id === m.competitionId)!,
    home,
    away: teamById(m.awayTeamId),
    kickoff: isoAt(m.dayOffset, m.time),
    venue: home.venue,
    round: m.round,
    status: m.status as Match['status'],
    score: m.score,
    featured: m.featured,
    tags: m.tags,
    headline: m.headline,
    coverage: {
      data: true,
      ai: aiAnalyses.some((a) => a.matchId === m.id),
      expert: expertInsights.some((e) => e.matchId === m.id),
    },
    call: pendingCalls.find((c) => c.matchId === m.id),
  };
});

const dayOffsetOf = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
};

/** Core comparison stats derived from season data, so every fixture has a data layer. */
function deriveStats(home: Team, away: Team): StatComparison[] {
  const h = home.season;
  const a = away.season;
  const per = (n: number, p: number) => +(n / p).toFixed(2);
  return [
    { label: 'League position', home: h.position, away: a.position, format: 'number', higherIsBetter: false },
    { label: 'Points per game', home: per(h.points, h.played), away: per(a.points, a.played), format: 'decimal' },
    { label: 'Goals scored / game', home: per(h.goalsFor, h.played), away: per(a.goalsFor, a.played), format: 'decimal' },
    { label: 'Goals conceded / game', home: per(h.goalsAgainst, h.played), away: per(a.goalsAgainst, a.played), format: 'decimal', higherIsBetter: false },
    { label: 'Expected goals (xG) / game', home: per(h.xgFor, h.played), away: per(a.xgFor, a.played), format: 'decimal' },
    { label: 'Possession', home: h.possession, away: a.possession, format: 'percent' },
    { label: 'Shots / game', home: h.shotsPerGame, away: a.shotsPerGame, format: 'decimal' },
    { label: 'Shots on target / game', home: h.shotsOnTargetPerGame, away: a.shotsOnTargetPerGame, format: 'decimal' },
    { label: 'Clean sheets', home: h.cleanSheets, away: a.cleanSheets, format: 'number' },
  ];
}

function buildData(match: Match): MatchData {
  const isPsg = match.id === 'psg-marseille';
  return {
    stats: deriveStats(match.home, match.away),
    extraStats: isPsg ? (psgIntel.extraStats.filter((s) => !s.label.startsWith('Expected goals')) as StatComparison[]) : [],
    h2h: isPsg ? psgIntel.h2h.map(({ daysAgo, ...h }) => ({ ...h, date: isoAt(-daysAgo) }) as HeadToHead) : [],
    goalTiming: isPsg ? psgIntel.goalTiming : undefined,
    keyAbsences: isPsg ? psgIntel.keyAbsences : [],
    updatedAt: new Date(Date.now() - (isPsg ? psgIntel.dataUpdatedMinutesAgo : 45) * 60_000).toISOString(),
  };
}

export const mockFootballProvider: FootballDataProvider = {
  async getMatches(dayOffset = 0) {
    return delay(
      matches.filter((m) => dayOffsetOf(m.kickoff) === dayOffset).sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
    );
  },
  async getFeaturedMatch() {
    return delay(matches.find((m) => m.featured)!);
  },
  async getMatchDetail(matchId) {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return delay(null);
    const raw = rawMatches.find((m) => m.id === matchId)!;
    return delay({
      match,
      data: buildData(match),
      ai: aiAnalyses.find((a) => a.matchId === matchId),
      expert: expertInsights.find((e) => e.matchId === matchId),
      call: match.call,
      risks: matchId === 'psg-marseille' ? (psgIntel.risks as Risk[]) : (raw.risks ?? []),
    });
  },
  async getAiAnalyses() {
    return delay(aiAnalyses);
  },
  async getExpertInsights() {
    return delay(expertInsights);
  },
};

export const mockTrackRecordProvider: TrackRecordProvider = {
  async getCalls() {
    return delay({ pending: pendingCalls, graded: gradedCalls });
  },
};

export const mockUserProvider: UserDataProvider = {
  async getCurrentUser() {
    return delay(userJson.user as DemoUser);
  },
  async getReadingHistory() {
    return delay(
      userJson.readingHistory.map((r) => {
        const call = gradedCalls.find((c) => c.id === r.callId)!;
        return { id: r.id, call, openedAt: minutesBefore(call.kickoff, r.openedMinutesBeforeKickoff) };
      }),
    );
  },
  async getNotifications() {
    return delay(userJson.notifications as CompanionNotification[]);
  },
  async getAlertPrefs() {
    return delay(userJson.alertPrefs as AlertPref[]);
  },
};
