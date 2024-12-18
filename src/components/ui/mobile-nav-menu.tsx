"use client";

import { useState } from "react";
import Link from "next/link";

import { groupCategories } from "@/lib/categories-map";
import { useDataContext } from "@/components/DataContext";
import CurrencyPopover from "@/app/_components/currency-popover";

import { Button } from "./button";
import { Logo } from "./logo";
import { Text } from "./text";

export function MobileNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    "men" | "women" | undefined
  >();

  function triggerNavMenu() {
    setIsOpen((v) => !v);
  }

  return (
    <div>
      <Button variant={"simple"} onClick={triggerNavMenu}>
        menu
      </Button>
      {isOpen && (
        <Menu
          onClose={triggerNavMenu}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}
    </div>
  );
}

function Menu({
  onClose,
  activeCategory,
  setActiveCategory,
}: {
  onClose: () => void;
  activeCategory: "men" | "women" | undefined;
  setActiveCategory: (category: "men" | "women" | undefined) => void;
}) {
  const { dictionary } = useDataContext();

  const categoriesGroups = groupCategories(
    dictionary?.categories?.map((v) => v.name as string) || [],
  );

  return (
    <div className="blackTheme absolute -bottom-2 -left-2 z-50 flex h-full h-screen w-screen flex-col justify-between overflow-hidden bg-bgColor p-2">
      <div className="space-y-14">
        <div className="flex h-12 items-center justify-between">
          {activeCategory ? (
            <>
              <Button onClick={() => setActiveCategory(undefined)}>
                <Text variant="uppercase">{"<"}</Text>
              </Button>
              <Text variant="uppercase">{activeCategory}</Text>
            </>
          ) : (
            <div className="size-8 bg-white">
              <Logo />
            </div>
          )}
          <Button variant={"simple"} onClick={onClose}>
            [x]
          </Button>
        </div>
        {activeCategory === undefined ? (
          <div className="space-y-6">
            <div className="space-y-6 border-b border-dashed border-textColor pb-6">
              <Button
                onClick={() => setActiveCategory("men")}
                className="w-full"
              >
                <div className="flex items-center justify-between">
                  <Text variant="uppercase">men</Text>
                  <Text variant="uppercase">{">"}</Text>
                </div>
              </Button>
              <Button
                onClick={() => setActiveCategory("women")}
                className="w-full"
              >
                <div className="flex items-center justify-between">
                  <Text variant="uppercase">women</Text>
                  <Text variant="uppercase">{">"}</Text>
                </div>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Button asChild>
                <Link href="/archive">
                  <Text variant="uppercase">archive</Text>
                </Link>
              </Button>
              <Text variant="uppercase">{">"}</Text>
            </div>
            <CurrencyPopover />
          </div>
        ) : (
          <div className="grow space-y-8">
            {Object.entries(categoriesGroups).map(([key, category]) => (
              <div
                key={key}
                className="grid w-full grid-cols-2 gap-2 space-y-4"
              >
                <Text variant="uppercase">{category.title}</Text>
                <div className="space-y-2">
                  <div>
                    <Button variant="simpleReverse" asChild>
                      <Link href="/catalog">view all</Link>
                    </Button>
                  </div>
                  {category.items.map((item) => (
                    <div key={item.id}>
                      <Button variant="simpleReverse" asChild>
                        <Link href={item.href}>{item.label.toLowerCase()}</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
