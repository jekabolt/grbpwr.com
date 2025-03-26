"use client";

import { useState } from "react";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { Button } from "./button";
import { WhiteLogo } from "./icons/white-logo";
import { DefaultMobileMenuDialog } from "./mobile-menu-dialog";
import { Text } from "./text";

export function MobileNavMenu() {
  const [activeCategory, setActiveCategory] = useState<
    "men" | "women" | undefined
  >();

  return (
    // <MobileMenuDialog
    //   activeCategory={activeCategory}
    //   setActiveCategory={setActiveCategory}
    // />
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <Button size="sm" variant="simpleReverse">
          menu
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Content className="fixed inset-0 z-30 bg-bgColor px-2.5 py-5">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="flex h-full flex-col border border-red-500">
            <div className="mb-14 border border-green-500">
              {activeCategory ? (
                <div className="flex items-center justify-between border border-blue-500">
                  <Button onClick={() => setActiveCategory(undefined)}>
                    {"<"}
                  </Button>
                  <Text variant="uppercase">{activeCategory}</Text>
                  <DialogPrimitives.Close asChild>
                    <Button>[x]</Button>
                  </DialogPrimitives.Close>
                </div>
              ) : (
                <div className="flex items-center justify-between border border-purple-500">
                  <DialogPrimitives.Close className="aspect-square size-7">
                    <WhiteLogo />
                  </DialogPrimitives.Close>
                  <DialogPrimitives.Close>
                    <Text>[x]</Text>
                  </DialogPrimitives.Close>
                </div>
              )}
            </div>
            {activeCategory === undefined ? (
              <DefaultMobileMenuDialog setActiveCategory={setActiveCategory} />
            ) : (
              <div></div>
            )}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
