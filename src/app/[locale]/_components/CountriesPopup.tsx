"use client";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { Overlay } from "@/components/ui/overlay";

import { CountriesContent } from "./CountriesContent";

export function CountriesPopup() {
  const { isOpen, closeCurrencyPopup } = useCurrency((state) => state);

  return (
    <>
      {/* <MobileCountriesPopup onCountrySelect={handleSelection} /> */}
      <div className="hidden lg:block">
        {isOpen && (
          <>
            <Overlay
              cover="screen"
              onClick={closeCurrencyPopup}
              disablePointerEvents={false}
            />
            <div className="blackTheme fixed right-0 top-0 z-30 h-screen w-[460px] bg-bgColor p-2.5 text-textColor">
              <CountriesContent />
            </div>
          </>
        )}
      </div>

      {/* <UpdateLocation
        selectedLocation={seletedLocation}
        onCancel={cancelSelection}
      /> */}
    </>
  );
}
