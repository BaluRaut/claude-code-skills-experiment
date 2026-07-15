// Small localStorage helper. Reads are validated with a type guard so bad
// data is dropped rather than crashing the app (DOC-2 AC-3). A tiny pub/sub
// lets the UI react to changes (DOC-2 AC-5).
const listeners = new Map<string, Set<() => void>>();

export function readRaw<T>(key: string, isValid: (x: unknown) => x is T): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValid) : [];
  } catch {
    return [];
  }
}

export function persist<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export function notify(key: string): void {
  const set = listeners.get(key);
  if (set) set.forEach((listener) => listener());
}

export function subscribe(key: string, listener: () => void): () => void {
  const set = listeners.get(key) ?? new Set<() => void>();
  set.add(listener);
  listeners.set(key, set);
  return () => {
    set.delete(listener);
  };
}
