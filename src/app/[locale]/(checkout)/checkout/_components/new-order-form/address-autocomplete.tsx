"use client";

import { useEffect, useRef } from "react";
import { keyboardRestrictions } from "@/constants";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import InputField from "@/components/ui/form/fields/input-field";

type AddressComponents = {
  streetNumber: string;
  route: string;
  postalCode: string;
};

function extractAddressComponents(addressComponents: any[]): AddressComponents {
  return addressComponents.reduce(
    (acc, component) => {
      const types = component.types;
      if (types.includes("street_number"))
        acc.streetNumber = component.long_name;
      else if (types.includes("route")) acc.route = component.long_name;
      else if (types.includes("postal_code"))
        acc.postalCode = component.long_name;
      return acc;
    },
    {
      streetNumber: "",
      route: "",
      postalCode: "",
    },
  );
}

function updateAddressFields(
  components: AddressComponents,
  prefix: string | undefined,
  setValue: (field: string, value: string) => void,
) {
  const address = [components.route, components.streetNumber]
    .filter(Boolean)
    .join(" ");

  const addressFieldName = prefix ? `${prefix}.address` : "address";
  const postalCodeFieldName = prefix ? `${prefix}.postalCode` : "postalCode";

  if (address) setValue(addressFieldName, address);
  if (components.postalCode)
    setValue(postalCodeFieldName, components.postalCode);
}

type Props = {
  loading: boolean;
  disabled?: boolean;
  prefix?: string;
  countryCode?: string | string[];
};

export default function AddressAutocomplete({
  loading,
  disabled,
  prefix,
  countryCode,
}: Props) {
  const { setValue } = useFormContext();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const t = useTranslations("checkout");
  const storeCountryCode = useTranslationsStore((s) => s.country.countryCode);
  const effectiveCountryCode = countryCode ?? storeCountryCode;

  useEffect(() => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;
    if (
      effectiveCountryCode &&
      typeof autocomplete.setComponentRestrictions === "function"
    ) {
      autocomplete.setComponentRestrictions({
        country: effectiveCountryCode as any,
      });
    } else if (typeof autocomplete.setComponentRestrictions === "function") {
      // Clear restrictions if country becomes undefined
      // @ts-expect-error: Google types don't expose clearing; passing empty object works
      autocomplete.setComponentRestrictions({});
    }
  }, [effectiveCountryCode]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
    language: "en",
  });

  if (!isLoaded) {
    return (
      <div className="relative">
        <InputField
          loading={true}
          name={prefix ? `${prefix}.address` : "address"}
          label={t("street and house number:")}
          placeholder="sjyrniesu 10"
          disabled={true}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <Autocomplete
        options={{
          componentRestrictions: effectiveCountryCode
            ? { country: effectiveCountryCode as any }
            : undefined,
          types: ["address"],
        }}
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
          autocomplete.setFields(["address_components"]);
          if (effectiveCountryCode) {
            autocomplete.setComponentRestrictions({
              country: effectiveCountryCode as any,
            });
          }
        }}
        onPlaceChanged={() => {
          const autocomplete = autocompleteRef.current;
          if (!autocomplete) return;
          const place = autocomplete.getPlace();
          if (!place || !place.address_components) return;
          const components = extractAddressComponents(place.address_components);
          updateAddressFields(components, prefix, setValue);
        }}
      >
        <InputField
          loading={loading}
          name={prefix ? `${prefix}.address` : "address"}
          label={t("street and house number:")}
          placeholder=" "
          disabled={disabled}
          keyboardRestriction={keyboardRestrictions.addressField}
        />
      </Autocomplete>
    </div>
  );
}
