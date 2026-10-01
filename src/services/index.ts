/**
 * Data access entry point. Components import from here — never from
 * providers directly — so the data source can be switched centrally.
 *
 *   VITE_DATA_SOURCE=mock   (default, the only option in the prototype)
 *   VITE_DATA_SOURCE=api    (future: see providers/apiProvider.ts)
 */
import { mockFootballProvider, mockUserProvider } from './providers/mockProvider';
import { mockAssistantProvider } from './providers/mockAssistant';
import type { AssistantProvider, FootballDataProvider, UserDataProvider } from './types';

const source = import.meta.env.VITE_DATA_SOURCE ?? 'mock';

function select(): {
  football: FootballDataProvider;
  user: UserDataProvider;
  assistant: AssistantProvider;
} {
  switch (source) {
    // case 'api':
    //   return { football: apiFootballProvider, user: apiUserProvider, assistant: apiAssistantProvider };
    default:
      return { football: mockFootballProvider, user: mockUserProvider, assistant: mockAssistantProvider };
  }
}

export const { football, user, assistant } = select();
export const IS_DEMO_DATA = source === 'mock';
export type { FootballDataProvider, UserDataProvider, AssistantProvider };
