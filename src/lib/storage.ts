// localstorage-repo skill: the ONE storage primitive. Nothing app-specific
// lives here — typed JSON get/set over a namespaced key plus a reactivity
// signal. Repositories are the only callers; components never touch this.

export function readList(key: string): unknown[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt/hand-edited JSON must never crash the app — treat as empty.
    return [];
  }
}

export function writeList(key: string, items: unknown[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export function notify(key: string): void {
  // The reactivity signal consumed by the useSyncExternalStore hooks.
  window.dispatchEvent(new Event(`store:${key}`));
}

export function storeEvent(key: string): string {
  return `store:${key}`;
}
