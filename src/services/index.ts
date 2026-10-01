/**
 * Data access entry point. Components import from here — never from
 * providers directly — so the data source can be switched centrally.
 *
 *   VITE_DATA_SOURCE=mock   (default, the only option in the prototype)
 *   VITE_DATA_SOURCE=api    (future: see providers/apiProvider.example.ts)
 */
import { mockFootballProvider, mockTrackRecordProvider, mockUserProvider } from './providers/mockProvider';
import { mockAssistantProvider } from './providers/mockAssistant';
import type { AssistantProvider, FootballDataProvider, TrackRecordProvider, UserDataProvider } from './types';

const source = import.meta.env.VITE_DATA_SOURCE ?? 'mock';

function select(): {
  football: FootballDataProvider;
  trackRecord: TrackRecordProvider;
  user: UserDataProvider;
  assistant: AssistantProvider;
} {
  switch (source) {
    // case 'api':
    //   return { football: apiFootballProvider, trackRecord: apiTrackRecordProvider, user: apiUserProvider, assistant: apiAssistantProvider };
    default:
      return { football: mockFootballProvider, trackRecord: mockTrackRecordProvider, user: mockUserProvider, assistant: mockAssistantProvider };
  }
}

export const { football, trackRecord, user, assistant } = select();
export const IS_DEMO_DATA = source === 'mock';
export type { FootballDataProvider, TrackRecordProvider, UserDataProvider, AssistantProvider };
