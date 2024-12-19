"use client";

import { useState } from "react";
import Link from "next/link";

import { groupCategories } from "@/lib/categories-map";
import { useDataContext } from "@/components/DataContext";
import CurrencyPopover from "@/app/_components/currency-popover";

import { Button } from "./button";
import { Logo } from "./logo";
import { MobileMenuDialog } from "./mobile-menu-dialog";
import { Text } from "./text";

export function MobileNavMenu() {
  const [activeCategory, setActiveCategory] = useState<
    "men" | "women" | undefined
  >();

  return (
    <div>
      <MobileMenuDialog
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      {/* <Button variant={"simple"} onClick={triggerNavMenu}>
          menu
        </Button>
        {isOpen && (
          <div className="fixed inset-0 z-50">
            <Menu
              onClose={triggerNavMenu}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>
        )} */}
    </div>
  );
}
