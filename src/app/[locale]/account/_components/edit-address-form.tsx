"use client";

import { useState } from "react";
import type { StorefrontSavedAddress } from "@/api/proto-http/frontend";
import { keyboardRestrictions } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/ui/form/fields/input-field";
import SelectField from "@/components/ui/form/fields/select-field";
import { Text } from "@/components/ui/text";
import AddressAutocomplete from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/address-autocomplete";
import CityAutocomplete from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/city-autocomplete";
import { countryStatesMap } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/constants";
import { getSortedCountries } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/utils";

const schema = z.object({
  country: z.string().min(2, "country is required"),
  state: z.string().optional(),
  city: z.string().min(1, "city is required"),
  address: z.string().min(3, "address is required"),
  additionalAddress: z.string().optional(),
  company: z.string().optional(),
  postalCode: z.string().min(2, "postal code is required"),
});

type FormData = z.infer<typeof schema>;

const sortedCountries = getSortedCountries();

export function EditAddressForm({
  address,
  onSuccess,
  onCancel,
}: {
  address: StorefrontSavedAddress;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: address.country ?? "",
      state: address.state ?? "",
      city: address.city ?? "",
      address: address.addressLineOne ?? "",
      additionalAddress: address.addressLineTwo ?? "",
      company: address.company ?? "",
      postalCode: address.postalCode ?? "",
    },
  });

  const selectedCountry = useWatch({ control: form.control, name: "country" });
  const stateItems =
    countryStatesMap[selectedCountry as keyof typeof countryStatesMap] ?? [];

  async function onSubmit(data: FormData) {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/account/addresses/${address.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: {
            country: data.country.trim(),
            state: data.state?.trim() ?? "",
            city: data.city.trim(),
            addressLineOne: data.address.trim(),
            addressLineTwo: data.additionalAddress?.trim() ?? "",
            company: data.company?.trim() ?? "",
            postalCode: data.postalCode.trim(),
            isDefault: address.isDefault ?? false,
          },
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "failed to update address");
        return;
      }
      onSuccess();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <AddressAutocomplete
          loading={saving}
          disabled={saving}
          countryCode={selectedCountry}
        />

        <SelectField
          loading={saving}
          variant="secondary"
          fullWidth
          name="country"
          label="country/region:"
          items={sortedCountries}
          disabled={saving}
          onValueChange={(v: string) => {
            form.setValue("country", v, { shouldValidate: true });
            form.setValue("state", "", { shouldValidate: false });
            form.setValue("city", "", { shouldValidate: false });
          }}
        />

        {stateItems.length > 0 && (
          <SelectField
            name="state"
            label="state:"
            items={stateItems}
            disabled={saving}
          />
        )}

        <CityAutocomplete
          loading={saving}
          disabled={saving}
          countryCode={selectedCountry}
        />

        <InputField
          loading={saving}
          variant="secondary"
          name="additionalAddress"
          label="additional address:"
          disabled={saving}
          keyboardRestriction={keyboardRestrictions.addressField}
        />

        <InputField
          loading={saving}
          variant="secondary"
          name="company"
          label="company:"
          disabled={saving}
          keyboardRestriction={keyboardRestrictions.companyField}
        />

        <InputField
          loading={saving}
          variant="secondary"
          name="postalCode"
          label="postal code:"
          disabled={saving}
          keyboardRestriction={keyboardRestrictions.postalCodeField}
        />

        {error && <Text variant="inactive">{error}</Text>}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="main"
            size="lg"
            className="w-full uppercase"
            disabled={saving}
            loading={saving}
            onClick={form.handleSubmit(onSubmit)}
          >
            save
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full uppercase"
            disabled={saving}
            onClick={onCancel}
          >
            cancel
          </Button>
        </div>
      </div>
    </Form>
  );
}
