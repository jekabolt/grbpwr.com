"use client";

import { useState } from "react";
import { CountryOption } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { Overlay } from "@/components/ui/overlay";
import { UpdateLocation } from "@/components/ui/update-location";

import { CountriesContent } from "./CountriesContent";
import { MobileCountriesPopup } from "./mobile-countries-popup";

export function CountriesPopup() {
  const [seletedLocation, setSeletedLocation] = useState<CountryOption>();
  const { isOpen, closeCurrencyPopup } = useCurrency((state) => state);

  function handleSelection(location: CountryOption) {
    setSeletedLocation(location);
    closeCurrencyPopup();
  }

  function cancelSelection() {
    setSeletedLocation(undefined);
  }

  return (
    <>
      <MobileCountriesPopup onCountrySelect={handleSelection} />
      <div className="hidden lg:block">
        {isOpen && (
          <>
            <Overlay
              cover="screen"
              onClick={closeCurrencyPopup}
              disablePointerEvents={false}
            />
            <div className="blackTheme fixed right-0 top-0 z-30 h-screen w-[460px] bg-bgColor p-2.5 text-textColor">
              <CountriesContent onSelect={handleSelection} />
            </div>
          </>
        )}
      </div>
      {seletedLocation && (
        <UpdateLocation
          selectedLocation={seletedLocation}
          onCancel={cancelSelection}
        />
      )}
    </>
  );
}
