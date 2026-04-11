import { generateSalt, hashPassword, verifyPassword } from '@/src/auth/password';

import { getDatabase } from './database';

export type UserRow = { id: number; email: string };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: string }).message === 'string' &&
    ((error as { message: string }).message.includes('UNIQUE') ||
      (error as { message: string }).message.includes('constraint'))
  );
}

export type RegisterResult =
  | { ok: true; user: UserRow }
  | { ok: false; code: 'EMAIL_TAKEN' | 'WEAK_PASSWORD' | 'INVALID_EMAIL' };

/**
 * Registers a new user with salted SHA-256 password material stored locally.
 */
export async function registerUser(email: string, password: string): Promise<RegisterResult> {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) {
    return { ok: false, code: 'INVALID_EMAIL' };
  }
  if (password.length < 8) {
    return { ok: false, code: 'WEAK_PASSWORD' };
  }

  const salt = await generateSalt();
  const passwordHash = await hashPassword(password, salt);
  const db = await getDatabase();

  try {
    const result = await db.runAsync(
      'INSERT INTO users (email, password_hash, salt) VALUES (?, ?, ?);',
      [normalized, passwordHash, salt]
    );
    const id = Number(result.lastInsertRowId);
    return { ok: true, user: { id, email: normalized } };
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, code: 'EMAIL_TAKEN' };
    }
    throw error;
  }
}

/**
 * Validates credentials against the local users table.
 */
export async function verifyUserCredentials(email: string, password: string): Promise<UserRow | null> {
  const normalized = normalizeEmail(email);
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    id: number;
    email: string;
    password_hash: string;
    salt: string;
  }>('SELECT id, email, password_hash, salt FROM users WHERE email = ? LIMIT 1;', [normalized]);

  if (!row) return null;

  const valid = await verifyPassword(password, row.salt, row.password_hash);
  if (!valid) return null;

  return { id: row.id, email: row.email };
}

export async function getUserById(id: number): Promise<UserRow | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<UserRow>(
    'SELECT id, email FROM users WHERE id = ? LIMIT 1;',
    [id]
  );
  return row ?? null;
}
