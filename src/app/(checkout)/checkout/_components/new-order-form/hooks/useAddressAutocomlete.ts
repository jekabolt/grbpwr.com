'use client'

import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

type AddressComponents = {
    streetNumber: string;
    route: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
};

const ADDRESS_FIELDS = {
    street_number: "streetNumber",
    route: "route",
    locality: "city",
    administrative_area_level_1: "state",
    country: "country",
    postal_code: "postalCode",
} as const;

type UseAddressAutocompleteProps = {
    prefix?: string;
    onAddressChange?: (address: Record<string, string>) => void;
};

export function useAddressAutocomplete({ prefix, onAddressChange }: UseAddressAutocompleteProps) {
    const { setValue } = useFormContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    });

    const initializeAutocomplete = (input: HTMLInputElement) => {
        if (!window.google) return;

        const autocomplete = new window.google.maps.places.Autocomplete(input, {
            fields: ["address_components", "formatted_address"],
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place?.address_components) return;

            const components = place.address_components.reduce<AddressComponents>(
                (acc, component) => {
                    const type = component.types.find((t) => t in ADDRESS_FIELDS);
                    if (type) {
                        const field = ADDRESS_FIELDS[type as keyof typeof ADDRESS_FIELDS];
                        acc[field] = type === "country" ? component.short_name : component.long_name;
                    }
                    return acc;
                },
                {
                    streetNumber: "",
                    route: "",
                    city: "",
                    state: "",
                    country: "",
                    postalCode: "",
                }
            );

            let address = '';
            if (components.streetNumber && components.route) {
                address = `${components.streetNumber} ${components.route}`.trim();
            } else {
                address = components.route;
            }

            const fields = {
                address,
                city: components.city,
                state: components.state,
                country: components.country,
                postalCode: components.postalCode,
            };

            Object.entries(fields).forEach(([key, value]) => {
                const fieldName = prefix ? `${prefix}.${key}` : key;
                setValue(fieldName, value, { shouldValidate: true });
            });

            if (inputRef.current) {
                inputRef.current.value = fields.address;
            }

            onAddressChange?.(fields);
        });

        autocompleteRef.current = autocomplete;
    };

    useEffect(() => {
        if (!isLoaded || !inputRef.current) return;
        initializeAutocomplete(inputRef.current);
    }, [isLoaded]);

    return {
        isLoaded,
        inputRef,

    };
}