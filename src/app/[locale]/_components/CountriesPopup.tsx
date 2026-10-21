"use client";

import * as DialogPrimitives from "@radix-ui/react-dialog";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";

import { CountriesContent } from "./CountriesContent";
import { MobileCountriesPopup } from "./mobile-countries-popup";

export function CountriesPopup() {
  const { isOpen, closeCountryPopup } = useTranslationsStore((s) => s);
  const { dictionary } = useDataContext();
  const isWebsiteEnabled = dictionary?.siteEnabled;
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      <MobileCountriesPopup />
      <DialogPrimitives.Root
        open={isDesktop && isOpen}
        onOpenChange={closeCountryPopup}
      >
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay className="fixed inset-0 z-20 bg-overlay data-[state=open]:animate-modal-fade-in data-[state=closed]:animate-modal-fade-out" />
          <DialogPrimitives.Content
            aria-describedby={undefined}
            className={cn(
              "fixed inset-y-2 right-2 z-[70] w-[460px] overflow-y-auto border border-textInactiveColor bg-bgColor p-2.5 text-textColor data-[state=open]:animate-modal-fade-in data-[state=closed]:animate-modal-fade-out",
              {
                blackTheme: !isWebsiteEnabled,
              },
            )}
          >
            <CountriesContent />
          </DialogPrimitives.Content>
        </DialogPrimitives.Portal>
      </DialogPrimitives.Root>
    </>
  );
}
