// DOC-2: persistence layer over localStorage. Kept isolated from UI — screens
// never touch localStorage directly (they go through the repositories/hooks).

/**
 * A tiny observable collection persisted to localStorage.
 * - Reads are resilient: corrupt/old JSON or invalid records are skipped
 *   instead of crashing the app (DOC-2 AC-3).
 * - Subscribers are notified on every write so the UI can re-render without a
 *   manual refresh (DOC-2 AC-5). Cross-tab updates via the `storage` event are
 *   also propagated.
 * - read() returns a cached array reference that only changes when the data
 *   actually changes, so it is safe as a useSyncExternalStore snapshot.
 */
export class Collection<T> {
  private readonly key: string;
  private readonly isValid: (value: unknown) => value is T;
  private readonly listeners = new Set<() => void>();
  private cache: T[] | null = null;

  constructor(key: string, isValid: (value: unknown) => value is T) {
    this.key = key;
    this.isValid = isValid;

    // Keep other tabs / windows in sync.
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === this.key) {
          this.cache = null;
          this.emit();
        }
      });
    }
  }

  read(): T[] {
    if (this.cache !== null) return this.cache;
    this.cache = this.readFromStorage();
    return this.cache;
  }

  private readFromStorage(): T[] {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(this.key);
    } catch {
      return [];
    }
    if (!raw) return [];

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Corrupt JSON — do not crash, start clean (DOC-2 AC-3).
      return [];
    }
    if (!Array.isArray(parsed)) return [];

    // Skip any individual record that no longer matches the schema.
    return parsed.filter((item): item is T => this.isValid(item));
  }

  write(items: T[]): void {
    this.cache = items;
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch {
      // Storage full / unavailable — swallow so the UI does not crash.
    }
    this.emit();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

/** Generates a unique id (DOC-2 AC-4). */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
