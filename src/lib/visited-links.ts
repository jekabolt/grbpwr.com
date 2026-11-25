const KEY = "grbpwr-visited";
const EVT = "visited-links-change";

export function normalizeHref(href: string) {
  const path = href.split(/[?#]/)[0];
  const productIdx = path.indexOf("/p/");
  if (productIdx !== -1) return path.slice(productIdx);
  if (/^\/[a-z]{2}\/[a-z]{2}(?=\/|$)/i.test(path)) {
    return path.replace(/^\/[a-z]{2}\/([a-z]{2})(?=\/)/i, "/$1");
  }
  return path;
}

function read(): Set<string> {
  if (typeof sessionStorage === "undefined") return new Set();
  try {
    const raw = JSON.parse(sessionStorage.getItem(KEY) || "[]") as string[];
    return new Set(raw.map(normalizeHref));
  } catch {
    return new Set();
  }
}

export function markVisited(href: string) {
  const path = normalizeHref(href);
  if (!path || typeof sessionStorage === "undefined") return;

  const visited = read();
  if (visited.has(path)) return;

  visited.add(path);
  sessionStorage.setItem(KEY, JSON.stringify([...visited]));
  window.dispatchEvent(new Event(EVT));
}

export function isVisited(href: string) {
  const path = normalizeHref(href);
  return path ? read().has(path) : false;
}

export function subscribeVisited(onChange: () => void) {
  window.addEventListener(EVT, onChange);
  return () => window.removeEventListener(EVT, onChange);
}
