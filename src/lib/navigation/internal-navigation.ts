// Tracks in-app navigation as an explicit stack in sessionStorage so we can tell
// how deep we are within the app (and what the previous in-app page is) without
// the prev/last ping-pong the old implementation suffered from. Forward vs back
// is inferred by comparing the new path with the previous stack entry.

const STACK_KEY = "grbpwr_nav_stack";

function getStack(): string[] {
  try {
    const raw = sessionStorage.getItem(STACK_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function setStack(stack: string[]): void {
  try {
    sessionStorage.setItem(STACK_KEY, JSON.stringify(stack));
  } catch {
    /* sessionStorage unavailable */
  }
}

/** Called once when the app first mounts in a tab/session. */
export function syncNavigationOnEntry(currentPath: string): void {
  const stack = getStack();
  if (stack.length === 0) {
    setStack([currentPath]);
    return;
  }
  // Reload of an existing session: keep the stack; only adjust if the top no
  // longer matches the current path.
  if (stack[stack.length - 1] !== currentPath) {
    trackNavigationChange(currentPath);
  }
}

/** Called on every in-app navigation; maintains the forward/back nav stack. */
export function trackNavigationChange(currentPath: string): void {
  const stack = getStack();
  if (stack.length === 0) {
    setStack([currentPath]);
    return;
  }
  const top = stack[stack.length - 1];
  if (top === currentPath) return;

  const prev = stack[stack.length - 2];
  if (prev === currentPath) {
    stack.pop(); // back navigation
  } else {
    stack.push(currentPath); // forward navigation
  }
  setStack(stack);
}

/** True when there's an in-app page to return to (safe to call router.back()). */
/** The in-app page we'd return to, or null if we're at the session entry. */
export function getPreviousPath(): string | null {
  const stack = getStack();
  return stack.length > 1 ? stack[stack.length - 2] : null;
}
