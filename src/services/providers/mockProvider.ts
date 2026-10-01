/**
 * Mock provider — reads the DEMO JSON in src/data/mock and shapes it into
 * the domain model. Dates are stored as offsets ("dayOffset", "daysAgo")
 * so the prototype always looks current whenever it is demoed.
 */
import competitionsJson from '../../data/mock/competitions.json';
import teamsJson from '../../data/mock/teams.json';
import matchesJson from '../../data/mock/matches.json';
import aiJson from '../../data/mock/ai-analyses.json';
import insightsJson from '../../data/mock/expert-insights.json';
import userJson from '../../data/mock/user.json';
import psgMarseilleIntel from '../../data/mock/match-intel/psg-marseille.json';
import type {
  AiAnalysis,
  Competition,
  CompanionNotification,
  DemoUser,
  ExpertInsight,
  HistoryEntry,
  Match,
  MatchIntel,
  StatComparison,
  Team,
} from '../../types/football';
import type { FootballDataProvider, UserDataProvider } from '../types';

const LATENCY_MS = 220; // simulate network so loading states are visible

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function isoDaysFromToday(offset: number, time = '12:00'): string {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

const competitions = competitionsJson as Competition[];

type RawTeam = Omit<Team, 'recent' | 'colors'> & {
  colors: string[];
  recent: (Omit<Team['recent'][number], 'date'> & { daysAgo: number })[];
};

const teams: Team[] = (teamsJson as RawTeam[]).map((t) => ({
  ...t,
  colors: [t.colors[0], t.colors[1]] as [string, string],
  recent: t.recent.map(({ daysAgo, ...r }) => ({ ...r, date: isoDaysFromToday(-daysAgo) })),
}));

const teamById = (id: string): Team => {
  const t = teams.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown team ${id}`);
  return t;
};

type RawMatch = (typeof matchesJson)[number] & { score?: { home: number; away: number } };

const matches: Match[] = (matchesJson as RawMatch[]).map((m) => {
  const home = teamById(m.homeTeamId);
  return {
    id: m.id,
    competition: competitions.find((c) => c.id === m.competitionId)!,
    home,
    away: teamById(m.awayTeamId),
    kickoff: isoDaysFromToday(m.dayOffset, m.time),
    venue: home.venue,
    round: m.round,
    status: m.status as Match['status'],
    score: m.score,
    featured: m.featured,
    tags: m.tags,
    headline: m.headline,
    hasFullReport: m.hasFullReport,
  };
});

const dayOffsetOf = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
};

/** Core comparison stats derived from season data, so any fixture gets a detail view. */
function deriveStats(home: Team, away: Team): StatComparison[] {
  const h = home.season;
  const a = away.season;
  const per = (n: number, p: number) => +(n / p).toFixed(2);
  return [
    { label: 'League position', home: h.position, away: a.position, format: 'number', higherIsBetter: false },
    { label: 'Points per game', home: per(h.points, h.played), away: per(a.points, a.played), format: 'decimal' },
    { label: 'Goals scored / game', home: per(h.goalsFor, h.played), away: per(a.goalsFor, a.played), format: 'decimal' },
    { label: 'Goals conceded / game', home: per(h.goalsAgainst, h.played), away: per(a.goalsAgainst, a.played), format: 'decimal', higherIsBetter: false },
    { label: 'Possession', home: h.possession, away: a.possession, format: 'percent' },
    { label: 'Shots / game', home: h.shotsPerGame, away: a.shotsPerGame, format: 'decimal' },
    { label: 'Shots on target / game', home: h.shotsOnTargetPerGame, away: a.shotsOnTargetPerGame, format: 'decimal' },
    { label: 'Clean sheets', home: h.cleanSheets, away: a.cleanSheets, format: 'number' },
  ];
}

const intelByMatch: Record<string, MatchIntel> = {
  'psg-marseille': (() => {
    const raw = psgMarseilleIntel;
    return {
      ...raw,
      h2h: raw.h2h.map(({ daysAgo, ...h }) => ({ ...h, date: isoDaysFromToday(-daysAgo) })),
      extraStats: raw.extraStats as StatComparison[],
      aiSummary: raw.aiSummary as AiAnalysis,
      expert: raw.expert as ExpertInsight,
      risks: raw.risks as MatchIntel['risks'],
      outlook: raw.outlook as MatchIntel['outlook'],
    };
  })(),
};

export const mockFootballProvider: FootballDataProvider = {
  async getMatches(dayOffset = 0) {
    return delay(
      matches
        .filter((m) => dayOffsetOf(m.kickoff) === dayOffset)
        .sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
    );
  },
  async getFeaturedMatch() {
    return delay(matches.find((m) => m.featured)!);
  },
  async getMatchDetail(matchId) {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return delay(null);
    return delay({ match, stats: deriveStats(match.home, match.away), intel: intelByMatch[matchId] });
  },
  async getAiAnalyses() {
    return delay([intelByMatch['psg-marseille'].aiSummary, ...(aiJson as AiAnalysis[])]);
  },
  async getExpertInsights() {
    return delay([intelByMatch['psg-marseille'].expert, ...(insightsJson as ExpertInsight[])]);
  },
};

export const mockUserProvider: UserDataProvider = {
  async getCurrentUser() {
    return delay(userJson.user as DemoUser);
  },
  async getHistory() {
    return delay(
      userJson.history.map(({ daysAgo, ...h }) => ({ ...h, date: isoDaysFromToday(-daysAgo) })) as HistoryEntry[],
    );
  },
  async getNotifications() {
    return delay(userJson.notifications as CompanionNotification[]);
  },
};

/** Synchronous lookup used by small UI helpers (e.g. saved-match chips). */
export const mockMatchIndex = matches;
