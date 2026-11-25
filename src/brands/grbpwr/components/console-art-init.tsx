"use client";

import { useEffect } from "react";

import { initConsoleArt } from "./console-art";

export function ConsoleArtInit() {
  useEffect(() => {
    initConsoleArt();
  }, []);

  return null;
}
