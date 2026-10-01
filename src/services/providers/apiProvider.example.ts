/**
 * EXAMPLE ONLY — not wired up. Shows how a real sports-data API would be
 * adapted to the FootballDataProvider contract. Keep vendor response
 * shapes inside this file; map them to the domain types in src/types.
 *
 * In production, call your own backend (BFF) rather than the vendor
 * directly, so API keys never ship to the browser and responses can be
 * cached / rate-limited server-side.
 */
import type { FootballDataProvider } from '../types';
import type { Match } from '../../types/football';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json() as Promise<T>;
}

// Example vendor shape → domain mapper
type VendorFixture = { fixture_id: number; starting_at: string /* … */ };
declare function mapFixture(f: VendorFixture): Match;

export const apiFootballProvider: Partial<FootballDataProvider> = {
  async getMatches(dayOffset = 0) {
    const fixtures = await get<VendorFixture[]>(`/fixtures?dayOffset=${dayOffset}`);
    return fixtures.map(mapFixture);
  },
  // getFeaturedMatch, getMatchDetail, getAiAnalyses, getExpertInsights …
};
