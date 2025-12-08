"use client";

import { useState } from "react";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { Button } from "./button";
import { DialogBackgroundManager } from "./dialog-background-manager";
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
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    "men" | "women" | undefined
  >();
  const t = useTranslations("navigation");

  return (
    <>
      <DialogBackgroundManager isOpen={open} backgroundColor="#ffffff" />
      <DialogPrimitives.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitives.Trigger asChild>
          <Button size="lg" className="w-full text-left">
            {t("menu")}
          </Button>
        </DialogPrimitives.Trigger>
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay className="fixed inset-0 z-40 bg-bgColor" />
          <DialogPrimitives.Content className="fixed inset-0 z-50 bg-bgColor px-2.5 pb-4 pt-5">
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
    </>
  );
}
