import type {
  AiAnalysis,
  CompanionNotification,
  DemoUser,
  ExpertInsight,
  HistoryEntry,
  Match,
  MatchDetail,
} from '../types/football';
import type { AssistantReply } from '../types/assistant';

/**
 * The single contract every football data source must implement.
 * UI code only ever talks to this interface (via `dataProvider`), so
 * swapping mock JSON for a real API is a change in one place.
 */
export interface FootballDataProvider {
  /** Fixtures for a given day (0 = today, 1 = tomorrow, …). */
  getMatches(dayOffset?: number): Promise<Match[]>;
  getFeaturedMatch(): Promise<Match>;
  getMatchDetail(matchId: string): Promise<MatchDetail | null>;
  getAiAnalyses(): Promise<AiAnalysis[]>;
  getExpertInsights(): Promise<ExpertInsight[]>;
}

/** User-scoped data. Will sit behind real auth later. */
export interface UserDataProvider {
  getCurrentUser(): Promise<DemoUser>;
  getHistory(): Promise<HistoryEntry[]>;
  getNotifications(): Promise<CompanionNotification[]>;
}

/** The AI research assistant. Today: scripted demo replies. */
export interface AssistantProvider {
  getSuggestedPrompts(): string[];
  ask(question: string, context?: { matchId?: string }): Promise<AssistantReply>;
}
