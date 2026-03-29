"use client";

import { useEffect, useRef } from "react";
import { keyboardRestrictions } from "@/constants";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import InputField from "@/components/ui/form/fields/input-field";

import { getFieldName } from "./utils";

type Props = {
  loading: boolean;
  disabled?: boolean;
  prefix?: string;
  countryCode?: string;
};

export default function CityAutocomplete({
  loading,
  disabled,
  prefix,
  countryCode,
}: Props) {
  const { setValue } = useFormContext();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const t = useTranslations("checkout");
  const cityFieldName = getFieldName(prefix, "city");
  const cc = countryCode?.toLowerCase() || "";

  useEffect(() => {
    const ac = autocompleteRef.current;
    if (!ac || !cc) return;
    if (typeof ac.setComponentRestrictions === "function") {
      ac.setComponentRestrictions({ country: cc as any });
    }
  }, [cc]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
    language: "en",
  });

  if (!isLoaded) {
    return (
      <InputField
        loading={true}
        variant="secondary"
        name={cityFieldName}
        label={t("city:")}
        placeholder=""
        disabled={true}
      />
    );
  }

  if (!cc) {
    return (
      <InputField
        loading={loading}
        variant="secondary"
        name={cityFieldName}
        label={t("city:")}
        placeholder=""
        disabled={true}
      />
    );
  }

  return (
    <Autocomplete
      key={cc}
      options={{
        types: ["(cities)"],
        componentRestrictions: { country: cc as any },
      }}
      onLoad={(ac) => {
        autocompleteRef.current = ac;
        ac.setFields(["address_components", "name", "formatted_address"]);
        ac.setComponentRestrictions({ country: cc as any });
        queueMicrotask(() => {
          const el = document.getElementById(cityFieldName);
          if (el instanceof HTMLInputElement) el.placeholder = "";
        });
      }}
      onPlaceChanged={() => {
        const ac = autocompleteRef.current;
        if (!ac) return;
        const place = ac.getPlace();
        const name = place?.name?.trim();
        if (!name) return;
        setValue(cityFieldName, name, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }}
    >
      <InputField
        loading={loading}
        variant="secondary"
        name={cityFieldName}
        label={t("city:")}
        placeholder=""
        disabled={disabled}
        keyboardRestriction={keyboardRestrictions.nameFields}
      />
    </Autocomplete>
  );
}
