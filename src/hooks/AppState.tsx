import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import userJson from '../data/mock/user.json';

type Theme = 'dark' | 'light';

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  savedMatchIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  membershipOpen: boolean;
  openMembership: () => void;
  closeMembership: () => void;
}

const Ctx = createContext<AppState | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — prototype keeps working in memory */
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = document.documentElement.dataset.theme;
    return t === 'light' ? 'light' : 'dark';
  });
  const [savedMatchIds, setSaved] = useState<string[]>(() => read('vx1-saved', userJson.user.savedMatchIds));
  const [membershipOpen, setMembershipOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('vx1-theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => write('vx1-saved', savedMatchIds), [savedMatchIds]);

  const toggleSaved = useCallback(
    (id: string) => setSaved((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])),
    [],
  );

  const value = useMemo<AppState>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      savedMatchIds,
      isSaved: (id) => savedMatchIds.includes(id),
      toggleSaved,
      membershipOpen,
      openMembership: () => setMembershipOpen(true),
      closeMembership: () => setMembershipOpen(false),
    }),
    [theme, savedMatchIds, toggleSaved, membershipOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
