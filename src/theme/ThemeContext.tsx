import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getStoredColorMode, setStoredColorMode } from '@/src/db/themePreference';
import {
  darkColors,
  lightColors,
  type ColorMode,
  type ThemeColors,
} from '@/src/theme/colors';

export type ThemeContextValue = {
  mode: ColorMode;
  colors: ThemeColors;
  isDark: boolean;
  /** False until the saved preference is read from SQLite. */
  isReady: boolean;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stored = await getStoredColorMode();
        if (!cancelled && stored) {
          setModeState(stored);
        }
      } catch (error) {
        console.error('Theme bootstrap failed', error);
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    void setStoredColorMode(next).catch((error) => {
      console.error('Failed to persist color mode', error);
    });
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => {
      const next: ColorMode = current === 'light' ? 'dark' : 'light';
      void setStoredColorMode(next).catch((error) => {
        console.error('Failed to persist color mode', error);
      });
      return next;
    });
  }, []);

  const colors = mode === 'dark' ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      mode,
      colors,
      isDark: mode === 'dark',
      isReady,
      setMode,
      toggleMode,
    }),
    [mode, colors, isReady, setMode, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
