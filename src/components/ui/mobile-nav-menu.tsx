"use client";

import { useState } from "react";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { Button } from "./button";
import { WhiteLogo } from "./icons/white-logo";
import {
  ActiveCategoryMenuDialog,
  DefaultMobileMenuDialog,
} from "./mobile-menu-dialog";
import { Text } from "./text";

export function MobileNavMenu() {
  const [activeCategory, setActiveCategory] = useState<
    "men" | "women" | undefined
  >();

  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <Button
          size="lg"
          className="w-full border border-red-500"
          variant="simpleReverse"
        >
          menu
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Content className="fixed inset-0 z-30 bg-bgColor px-2.5 py-5">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="flex h-full flex-col">
            <div className="mb-14">
              {activeCategory ? (
                <div className="flex items-center justify-between">
                  <Button onClick={() => setActiveCategory(undefined)}>
                    {"<"}
                  </Button>
                  <Text variant="uppercase">{activeCategory}</Text>
                  <DialogPrimitives.Close asChild>
                    <Button>[x]</Button>
                  </DialogPrimitives.Close>
                </div>
              ) : (
                <div className="flex items-center justify-between">
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
              <ActiveCategoryMenuDialog activeCategory={activeCategory} />
            )}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
