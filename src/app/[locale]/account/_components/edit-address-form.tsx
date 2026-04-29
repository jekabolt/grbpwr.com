"use client";

import { useState } from "react";
import type {
  StorefrontAccount,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormPhoneField } from "@/components/ui/form/fields/form-phone-field";
import InputField from "@/components/ui/form/fields/input-field";
import { Text } from "@/components/ui/text";
import { AddressFields } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/shipping-fields-group";
import { parseApiError } from "@/app/[locale]/account/utils/api-error";

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  country: z.string().min(2, "country is required"),
  state: z.string().optional(),
  city: z.string().min(1, "city is required"),
  address: z.string().min(3, "address is required"),
  additionalAddress: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  postalCode: z.string().min(2, "postal code is required"),
});

type FormData = z.infer<typeof schema>;

export function EditAddressForm({
  address,
  account,
  onSuccess,
  onCancel,
}: {
  address: StorefrontSavedAddress;
  account: StorefrontAccount;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("checkout");
  const tAccount = useTranslations("account");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: account.firstName ?? "",
      lastName: account.lastName ?? "",
      country: address.country ?? "",
      state: address.state ?? "",
      city: address.city ?? "",
      address: address.addressLineOne ?? "",
      additionalAddress: address.addressLineTwo ?? "",
      company: address.company ?? "",
      phone: account.phone ?? "",
      postalCode: address.postalCode ?? "",
    },
  });

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
      if (!res.ok) {
        setError(await parseApiError(res, "failed to update address"));
        return;
      }
      onSuccess();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-6">
          <InputField
            loading={saving}
            variant="secondary"
            name="firstName"
            label={`${t("first name")}:`}
            disabled={saving}
            readOnly
          />
          <InputField
            loading={saving}
            variant="secondary"
            name="lastName"
            label={`${t("last name")}:`}
            disabled={saving}
            readOnly
          />
        </div>
        <AddressFields
          loading={saving}
          disabled={saving}
          showNameFields={false}
          showPhoneField={false}
          disableCountryField
        />
        <FormPhoneField
          loading={saving}
          variant="secondary"
          name="phone"
          label={`${t("phone number:")}`}
          disabled={saving}
          readOnly
        />

        {error && <Text variant="inactive">{error}</Text>}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="main"
            size="lg"
            className="fixed inset-x-2.5 bottom-2.5 mx-auto uppercase lg:static lg:w-full"
            disabled={saving}
            loading={saving}
            onClick={form.handleSubmit(onSubmit)}
          >
            {tAccount("save")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="hidden w-full uppercase lg:block"
            disabled={saving}
            onClick={onCancel}
          >
            {tAccount("cancel")}
          </Button>
        </div>
      </div>
    </Form>
  );
}
