"use client";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { ModalTransition } from "@/components/modal-transition";
import { Overlay } from "@/components/ui/overlay";

import { CountriesContent } from "./CountriesContent";
import { MobileCountriesPopup } from "./mobile-countries-popup";

export function CountriesPopup() {
  const { isOpen, closeCountryPopup } = useTranslationsStore((s) => s);

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
              contentClassName="fixed inset-y-2 right-2 z-30 w-[460px] border border-textInactiveColor bg-bgColor p-2.5 text-textColor"
              content={<CountriesContent />}
            />
          </>
        )}
      </div>
    </>
  );
}
