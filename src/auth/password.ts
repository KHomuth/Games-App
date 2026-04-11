import * as Crypto from 'expo-crypto';

const SALT_BYTES = 16;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Creates a random salt for password hashing (demo-appropriate; not bcrypt). */
export async function generateSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(SALT_BYTES);
  return bytesToHex(bytes);
}

/** Deterministic SHA-256 hash for demo local auth (no external backend). */
export async function hashPassword(password: string, saltHex: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${saltHex}:${password}`
  );
}

export async function verifyPassword(
  password: string,
  saltHex: string,
  storedHashHex: string
): Promise<boolean> {
  const computed = await hashPassword(password, saltHex);
  return timingSafeEqualHex(computed.toLowerCase(), storedHashHex.toLowerCase());
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}
