"use client";

import { useState } from "react";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { useVisualViewportHeight } from "@/lib/hooks/useVisualViewportHeight";
import { ModalTransition } from "@/components/modal-transition";

import { useDataContext } from "../contexts/DataContext";
import { Button } from "./button";
import { DefaultMobileMenuDialog } from "./mobile-menu-dialog";
import { Text } from "./text";

export function MobileNavMenu({
  isBigMenuEnabled,
}: {
  isBigMenuEnabled?: boolean;
}) {
  const { dictionary } = useDataContext();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    "men" | "women" | undefined
  >();
  const t = useTranslations("navigation");
  const tAccessibility = useTranslations("accessibility");
  const isWebsiteEnabled = dictionary?.siteEnabled;

  const closeMenu = () => setOpen(false);
  const menuHeight = useVisualViewportHeight(open, 16);

  return (
    <DialogPrimitives.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitives.Trigger asChild>
        <Button
          size="lg"
          className="w-1/2 text-left transition-colors hover:opacity-70 active:opacity-50"
        >
          {t("menu")}
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-40 h-screen bg-overlay" />
        <ModalTransition
          isOpen={open}
          contentSlideFrom="top"
          contentClassName="fixed inset-x-2 bottom-2 top-2 z-40 border border-textInactiveColor bg-bgColor p-2.5"
          content={
            <DialogPrimitives.Content className="flex h-full flex-col">
              <DialogPrimitives.Title className="sr-only">
                {tAccessibility("mobile menu")}
              </DialogPrimitives.Title>
              <div className="flex h-full flex-col">
                <div className="mb-24">
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
                    <div className="flex items-center justify-between">
                      <Text variant="uppercase">{t("menu")}</Text>
                      <DialogPrimitives.Close>
                        <Text>[x]</Text>
                      </DialogPrimitives.Close>
                    </div>
                  )}
                </div>
                <div className="flex min-h-0 flex-1 flex-col">
                  <DefaultMobileMenuDialog
                    isWebsiteEnabled={isWebsiteEnabled}
                    closeMenu={closeMenu}
                  />
                </div>
              </div>
            </DialogPrimitives.Content>
          }
        />
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
