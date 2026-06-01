"use client";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { ModalTransition } from "@/components/modal-transition";
import { Overlay } from "@/components/ui/overlay";

import { CountriesContent } from "./CountriesContent";
import { MobileCountriesPopup } from "./mobile-countries-popup";

export function CountriesPopup() {
  const { isOpen, closeCountryPopup } = useTranslationsStore((s) => s);
  const { dictionary } = useDataContext();
  const isWebsiteEnabled = dictionary?.siteEnabled;

  return (
    <>
      <MobileCountriesPopup />
      <div className="hidden lg:block">
        {isOpen && (
          <>
            <Overlay
              cover="screen"
              onClick={closeCountryPopup}
              disablePointerEvents={false}
            />
            <ModalTransition
              isOpen={isOpen}
              contentSlideFrom="right"
              contentClassName={cn(
                "fixed inset-y-2 right-2 z-[70] w-[460px] border border-textInactiveColor bg-bgColor p-2.5 text-textColor",
                {
                  blackTheme: !isWebsiteEnabled,
                },
              )}
              content={<CountriesContent />}
            />
          </>
        )}
      </div>
    </>
  );
}
