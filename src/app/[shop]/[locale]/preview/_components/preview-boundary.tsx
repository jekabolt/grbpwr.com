"use client";

import { Component, type ReactNode } from "react";

interface Props {
  // A new draft (identity change) clears a previous render failure, so a good
  // draft recovers instead of staying stuck on the fallback forever.
  resetKey: unknown;
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  failed: boolean;
  key: unknown;
}

// A malformed draft (missing media, unexpected shape) can throw inside the
// previewed content. Without a boundary that throw blanks the whole preview
// iframe and the editor loses its canvas. Catching it shows a placeholder and
// recovers on the next draft. Shared by every /preview/* surface (hero,
// timeline, product).
export class PreviewBoundary extends Component<Props, State> {
  state: State = { failed: false, key: this.props.resetKey };

  static getDerivedStateFromError(): Partial<State> {
    return { failed: true };
  }

  static getDerivedStateFromProps(
    props: Props,
    state: State,
  ): Partial<State> | null {
    if (props.resetKey !== state.key) {
      return { failed: false, key: props.resetKey };
    }
    return null;
  }

  componentDidCatch() {
    // Swallowed on purpose: the fallback keeps the iframe alive and the editor
    // will push a corrected draft.
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
