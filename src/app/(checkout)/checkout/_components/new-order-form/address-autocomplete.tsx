"use client";

import { useRef } from "react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useFormContext } from "react-hook-form";

import InputField from "@/components/ui/form/fields/input-field";

import { countryStatesMap } from "./constants";

type AddressComponents = {
  streetNumber: string;
  route: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

function extractAddressComponents(addressComponents: any[]): AddressComponents {
  return addressComponents.reduce(
    (acc, component) => {
      const types = component.types;
      if (types.includes("street_number"))
        acc.streetNumber = component.long_name;
      else if (types.includes("route")) acc.route = component.long_name;
      else if (types.includes("locality")) acc.city = component.long_name;
      else if (types.includes("administrative_area_level_1"))
        acc.state = component.short_name;
      else if (types.includes("country")) acc.country = component.short_name;
      else if (types.includes("postal_code"))
        acc.postalCode = component.long_name;
      return acc;
    },
    {
      streetNumber: "",
      route: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  );
}

function updateFormValues(
  components: AddressComponents,
  prefix: string | undefined,
  setValue: (field: string, value: string) => void,
) {
  const address = [components.route, components.streetNumber]
    .filter(Boolean)
    .join(" ");

  const fields = {
    address,
    city: components.city,
    country: components.country,
    postalCode: components.postalCode,
  };

  Object.entries(fields).forEach(([key, value]) => {
    const fieldName = prefix ? `${prefix}.${key}` : key;
    setValue(fieldName, value);
  });

  const stateFieldName = prefix ? `${prefix}.state` : "state";
  const hasStates =
    components.country && components.country in countryStatesMap;
  if (hasStates) {
    setValue(stateFieldName, components.state);
  } else {
    setValue(stateFieldName, "");
  }
}

type Props = {
  loading: boolean;
  disabled?: boolean;
  prefix?: string;
};

export default function AddressAutocomplete({
  loading,
  disabled,
  prefix,
}: Props) {
  const { setValue } = useFormContext();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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
          label="street and house number:"
          placeholder="sjyrniesu 10"
          disabled={true}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <Autocomplete
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
          autocomplete.setFields(["address_components"]);
        }}
        onPlaceChanged={() => {
          const autocomplete = autocompleteRef.current;
          if (!autocomplete) return;
          const place = autocomplete.getPlace();
          if (!place || !place.address_components) return;
          const components = extractAddressComponents(place.address_components);
          updateFormValues(components, prefix, setValue);
        }}
      >
        <InputField
          loading={loading}
          name={prefix ? `${prefix}.address` : "address"}
          label="street and house number:"
          placeholder=" "
          disabled={disabled}
        />
      </Autocomplete>
    </div>
  );
}
