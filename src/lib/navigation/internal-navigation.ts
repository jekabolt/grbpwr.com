const PREV_PATH_KEY = "grbpwr_prev_path";
const LAST_PATH_KEY = "grbpwr_last_path";

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* sessionStorage unavailable */
  }
}

function remove(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* sessionStorage unavailable */
  }
}

export function getPreviousPath(): string | null {
  return read(PREV_PATH_KEY);
}

export function syncNavigationOnEntry(currentPath: string): void {
  write(LAST_PATH_KEY, currentPath);

  try {
    const navEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navEntry?.type !== "navigate") {
      return;
    }

    const ref = document.referrer;
    if (ref && new URL(ref).origin === window.location.origin) {
      const refPath = `${new URL(ref).pathname}${new URL(ref).search}${new URL(ref).hash}`;
      write(PREV_PATH_KEY, refPath);
      return;
    }

    remove(PREV_PATH_KEY);
  } catch {
    remove(PREV_PATH_KEY);
  }
}

export function trackNavigationChange(currentPath: string): void {
  const lastPath = read(LAST_PATH_KEY);

  if (lastPath && lastPath !== currentPath) {
    write(PREV_PATH_KEY, lastPath);
  }

  write(LAST_PATH_KEY, currentPath);
}
