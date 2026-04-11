import { useEffect, useState } from 'react';

/**
 * Delays updating the returned value until `delayMs` after the last change to `value`.
 * Used to avoid hammering the RAWG API on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
