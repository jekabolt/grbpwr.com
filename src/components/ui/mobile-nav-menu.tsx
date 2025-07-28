"use client";

import { useState } from "react";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { Button } from "./button";
import {
  ActiveCategoryMenuDialog,
  DefaultMobileMenuDialog,
} from "./mobile-menu-dialog";
import { Text } from "./text";

export function MobileNavMenu({
  isBigMenuEnabled,
}: {
  isBigMenuEnabled?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState<
    "men" | "women" | undefined
  >();

  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <Button size="lg" className="w-full text-left">
          menu
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Content className="fixed inset-0 z-40 bg-bgColor px-2.5 py-5">
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
                  {isBigMenuEnabled && (
                    <Text variant="uppercase">{activeCategory}</Text>
                  )}
                  <DialogPrimitives.Close asChild>
                    <Button>[x]</Button>
                  </DialogPrimitives.Close>
                </div>
              ) : (
                <div className="flex items-center justify-end">
                  <DialogPrimitives.Close>
                    <Text>[x]</Text>
                  </DialogPrimitives.Close>
                </div>
              )}
            </div>
            {activeCategory === undefined || !isBigMenuEnabled ? (
              <DefaultMobileMenuDialog
                setActiveCategory={setActiveCategory}
                isBigMenuEnabled={isBigMenuEnabled}
              />
            ) : (
              <ActiveCategoryMenuDialog activeCategory={activeCategory} />
            )}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
