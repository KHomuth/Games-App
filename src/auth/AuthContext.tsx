import * as SplashScreen from 'expo-splash-screen';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ensureRawgCatalogFresh } from '@/src/api/rawg/metadata';
import { getDatabase } from '@/src/db/database';
import { clearStoredUserId, getStoredUserId, setStoredUserId } from '@/src/db/session';
import { getUserById, registerUser, verifyUserCredentials, type UserRow } from '@/src/db/users';

export type AuthContextValue = {
  user: UserRow | null;
  /** False until SQLite is ready and any stored session is restored. */
  isReady: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRow | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await getDatabase();
        void ensureRawgCatalogFresh().catch((err) => {
          console.error('RAWG catalog sync failed', err);
        });
        const id = await getStoredUserId();
        if (id != null && !cancelled) {
          const row = await getUserById(id);
          if (row) {
            setUser(row);
          } else {
            await clearStoredUserId();
          }
        }
      } catch (error) {
        console.error('Auth bootstrap failed', error);
      } finally {
        if (!cancelled) {
          setIsReady(true);
          await SplashScreen.hideAsync();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const row = await verifyUserCredentials(email, password);
      if (!row) {
        return { ok: false as const, message: 'Invalid email or password.' };
      }
      await setStoredUserId(row.id);
      setUser(row);
      return { ok: true as const };
    } catch {
      return { ok: false as const, message: 'Could not sign in. Try again.' };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const result = await registerUser(email, password);
      if (!result.ok) {
        const messages = {
          EMAIL_TAKEN: 'That email is already registered.',
          INVALID_EMAIL: 'Enter a valid email address.',
          WEAK_PASSWORD: 'Use at least 8 characters for your password.',
        } satisfies Record<typeof result.code, string>;
        return { ok: false as const, message: messages[result.code] };
      }
      await setStoredUserId(result.user.id);
      setUser(result.user);
      return { ok: true as const };
    } catch {
      return { ok: false as const, message: 'Could not create account. Try again.' };
    }
  }, []);

  const signOut = useCallback(async () => {
    await clearStoredUserId();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isReady,
      signIn,
      signUp,
      signOut,
    }),
    [user, isReady, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
