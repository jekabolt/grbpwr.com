"use client";

import { Component, type ReactNode } from "react";

interface Props {
  /** Plain input shown if the Google Maps Autocomplete throws. */
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  failed: boolean;
}

// Google Maps Autocomplete throws when the Places library fails to initialize
// (RefererNotAllowedMapError, InvalidKey, quota exceeded, blocked script, …).
// Without a boundary that throw takes down the whole checkout form. Catching it
// lets the address/city field fall back to a plain text input so checkout keeps
// working — the customer just types the address manually, no autocomplete.
export class MapsAutocompleteBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch() {
    // Intentionally swallowed: the fallback input keeps checkout usable. The
    // underlying RefererNotAllowed/key error is already logged by Maps itself.
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
