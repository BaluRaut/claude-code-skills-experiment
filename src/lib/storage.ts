// localstorage-repo skill: the storage primitive. Persist is separate from
// notify so repositories can refresh their cached snapshot BEFORE telling
// subscribers (see the skill's §2/§3).
export function readList(key: string): unknown[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeList(key: string, items: unknown[]): void {
  localStorage.setItem(key, JSON.stringify(items)); // persist only
}

export function notify(key: string): void {
  window.dispatchEvent(new Event(`store:${key}`));
}

export function subscribeKey(key: string, cb: () => void): () => void {
  const event = `store:${key}`;
  window.addEventListener(event, cb);
  return () => window.removeEventListener(event, cb);
}
