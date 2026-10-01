import type {
  AiAnalysis,
  AlertPref,
  CompanionNotification,
  DemoUser,
  ExpertInsight,
  Match,
  MatchDetail,
  ReadingEntry,
  VisionCall,
} from '../types/football';
import type { AssistantReply } from '../types/assistant';

/**
 * The single contract every football data source must implement.
 * UI code only ever talks to this interface (via `services/index.ts`), so
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

/**
 * The public Track Record. In production this is backed by an append-only
 * store: calls can be created before kickoff and graded after full time,
 * but never edited.
 */
export interface TrackRecordProvider {
  getCalls(): Promise<{ pending: VisionCall[]; graded: VisionCall[] }>;
}

/** User-scoped data. Will sit behind real auth later. */
export interface UserDataProvider {
  getCurrentUser(): Promise<DemoUser>;
  getReadingHistory(): Promise<ReadingEntry[]>;
  getNotifications(): Promise<CompanionNotification[]>;
  getAlertPrefs(): Promise<AlertPref[]>;
}

/** The AI research assistant — a future layer. Today: scripted demo replies. */
export interface AssistantProvider {
  getSuggestedPrompts(): string[];
  ask(question: string, context?: { matchId?: string }): Promise<AssistantReply>;
}
