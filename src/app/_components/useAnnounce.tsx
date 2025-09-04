"use client";

import { useEffect, useState } from "react";

function getLastAnnounce() {
  try {
    if (typeof window !== undefined) {
      return localStorage.getItem("last-announce") || "";
    }
    return "";
  } catch (e) {
    console.log("No announce found", e);
    return "";
  }
}

function setLastAnnounce(message: string) {
  try {
    if (typeof window !== undefined) {
      localStorage.setItem("last-announce", message);
    }
  } catch (e) {
    console.log("Can't set last announce", e);
  }
}

export function useAnnounce(announce: string) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (announce) {
      const lastAnnounce = getLastAnnounce();
      setOpen(announce !== lastAnnounce);
    } else {
      setOpen(false);
    }
  }, [announce]);

  const handleClose = () => {
    setOpen(false);
    if (announce) {
      setLastAnnounce(announce);
    }
  };

  return { open, handleClose };
}
