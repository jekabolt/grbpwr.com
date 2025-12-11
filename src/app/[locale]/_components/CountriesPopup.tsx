"use client";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { Overlay } from "@/components/ui/overlay";

import { CountriesContent } from "./CountriesContent";
import { MobileCountriesPopup } from "./mobile-countries-popup";

export function CountriesPopup() {
  const { isOpen, closeCurrencyPopup } = useCurrency((state) => state);

  return (
    <>
      <MobileCountriesPopup />
      <div className="hidden lg:block">
        {isOpen && (
          <>
            <Overlay
              cover="screen"
              onClick={closeCurrencyPopup}
              disablePointerEvents={false}
            />
            <div className="fixed inset-y-2 right-2 z-30 w-[460px] border border-textInactiveColor bg-bgColor p-2.5 text-textColor">
              <CountriesContent />
            </div>
          </>
        )}
      </div>
    </>
  );
}
