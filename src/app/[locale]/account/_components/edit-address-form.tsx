"use client";

import { useMemo } from "react";
import type {
  StorefrontAccount,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";
import { CHECKOUT_ERROR_CITY_COUNTRY } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormPhoneField } from "@/components/ui/form/fields/form-phone-field";
import InputField from "@/components/ui/form/fields/input-field";
import { Text } from "@/components/ui/text";
import { AddressFields } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/shipping-fields-group";
import { verifyCityInCountry } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/verify-city";
import {
  createAddressEditSchema,
  type AddressEditFormData,
} from "@/app/[locale]/account/utils/schema";
import {
  buildAddressEditPayload,
  getAddressEditDefaultValues,
} from "@/app/[locale]/account/utils/utility";

export function EditAddressForm({
  address,
  account,
  isCheckout,
  onSuccess,
  onCancel,
}: {
  address: StorefrontSavedAddress;
  account: StorefrontAccount;
  isCheckout?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("checkout");
  const tAccount = useTranslations("account");

  const schema = useMemo(() => createAddressEditSchema(tAccount), [tAccount]);

  const form = useForm<AddressEditFormData>({
    resolver: zodResolver(schema),
    defaultValues: getAddressEditDefaultValues(account, address),
  });

  const isSubmitting = form.formState.isSubmitting;
  const readOnlyFieldProps = {
    loading: isSubmitting,
    variant: "secondary" as const,
    disabled: isSubmitting,
    readOnly: true,
  };

  async function onSubmit(data: AddressEditFormData) {
    if (!(await verifyCityInCountry(data.city.trim(), data.country.trim()))) {
      form.setError("city", {
        type: "manual",
        message: CHECKOUT_ERROR_CITY_COUNTRY,
      });
      return;
    }

    try {
      const res = await fetch(`/api/account/addresses/${address.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: buildAddressEditPayload(data, address.isDefault),
        }),
      });
      if (!res.ok) return;
    } catch (error) {
      console.error(error);
    }

    onSuccess();
  }

  return (
    <Form {...form}>
      <div
        className={cn("flex flex-col gap-12", {
          "gap-0": isCheckout,
        })}
      >
        {!isCheckout && (
          <div className="flex items-center justify-between">
            <Text variant="uppercase">{tAccount("edit shipping address")}</Text>
            <Button
              type="button"
              className="hidden lg:block"
              onClick={onCancel}
            >
              [x]
            </Button>
          </div>
        )}
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-6">
            <InputField
              {...readOnlyFieldProps}
              name="firstName"
              label={`${t("first name")}:`}
            />
            <InputField
              {...readOnlyFieldProps}
              name="lastName"
              label={`${t("last name")}:`}
            />
          </div>
          <AddressFields
            loading={isSubmitting}
            disabled={isSubmitting}
            showNameFields={false}
            showPhoneField={false}
            disableCountryField
          />
          <FormPhoneField
            loading={isSubmitting}
            variant="secondary"
            name="phone"
            label={t("phone number:")}
            disabled
            readOnly
            displayTrigger={false}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="main"
              size="lg"
              className="fixed inset-x-2.5 bottom-2.5 mx-auto uppercase lg:static lg:w-full"
              disabled={isSubmitting}
              loading={isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {tAccount("save")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="hidden w-full uppercase lg:block"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              {tAccount("cancel")}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}
