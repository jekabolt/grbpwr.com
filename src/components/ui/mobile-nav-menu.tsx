"use client";

import { useState } from "react";

import { MobileMenuDialog } from "./mobile-menu-dialog";

export function MobileNavMenu() {
  const [activeCategory, setActiveCategory] = useState<
    "men" | "women" | undefined
  >();

  return (
    <MobileMenuDialog
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
    />
  );
}
