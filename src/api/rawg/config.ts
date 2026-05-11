import { RawgConfigError } from './errors';

export function getRawgApiKey(): string {
  const key =
    process.env.EXPO_PUBLIC_RAWG_API_KEY?.trim() ||
    process.env.EXPO_PUBLIC_API_KEY?.trim();
  if (!key) {
    throw new RawgConfigError(
      'Missing API key. Set EXPO_PUBLIC_RAWG_API_KEY in your .env file (see README).'
    );
  }
  return key;
}
