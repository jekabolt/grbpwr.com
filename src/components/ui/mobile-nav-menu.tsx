"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { useDataContext } from "../contexts/DataContext";
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
  const { dictionary } = useDataContext();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    "men" | "women" | undefined
  >();
  const t = useTranslations("navigation");
  const tAccessibility = useTranslations("accessibility");
  const isWebsiteEnabled = dictionary?.siteEnabled;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
    setActiveCategory(undefined);
  }, [pathname, searchParamsKey]);

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
        <DialogPrimitives.Overlay className="fixed inset-0 z-40 h-screen bg-overlay data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out" />
        <DialogPrimitives.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed inset-x-2 bottom-2 top-2 z-40 flex flex-col border border-textInactiveColor bg-bgColor p-2.5 data-[state=open]:animate-panel-in data-[state=closed]:animate-panel-out"
        >
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
                {activeCategory === undefined ||
                !isBigMenuEnabled ||
                !isWebsiteEnabled ? (
                  <DefaultMobileMenuDialog
                    setActiveCategory={setActiveCategory}
                    isBigMenuEnabled={isBigMenuEnabled}
                    isWebsiteEnabled={isWebsiteEnabled}
                    closeMenu={closeMenu}
                  />
                ) : (
                  <ActiveCategoryMenuDialog
                    activeCategory={activeCategory}
                    closeMenu={closeMenu}
                  />
                )}
              </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
