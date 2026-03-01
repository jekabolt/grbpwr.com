"use client";

import { useEffect } from "react";

import { sendPageNotFoundEvent } from "@/lib/analitycs/not-found";

export function NotFoundTracker() {
  useEffect(() => {
    sendPageNotFoundEvent();
  }, []);

  return null;
}
