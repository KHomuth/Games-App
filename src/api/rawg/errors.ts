export class RawgConfigError extends Error {
  override name = 'RawgConfigError';
}

export class RawgHttpError extends Error {
  override name = 'RawgHttpError';

  constructor(
    readonly status: number,
    bodySnippet: string
  ) {
    super(`RAWG request failed (${status}): ${bodySnippet.slice(0, 120)}`);
  }
}
