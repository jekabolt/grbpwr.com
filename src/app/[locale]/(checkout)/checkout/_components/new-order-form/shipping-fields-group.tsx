"use client";

import { keyboardRestrictions } from "@/constants";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { useDataContext } from "@/components/contexts/DataContext";
import InputField from "@/components/ui/form/fields/input-field";
import { PhoneField } from "@/components/ui/form/fields/phone-field";
import RadioGroupField from "@/components/ui/form/fields/radio-group-field";
import SelectField from "@/components/ui/form/fields/select-field";
import { Text } from "@/components/ui/text";

import AddressAutocomplete from "./address-autocomplete";
import FieldsGroupContainer from "./fields-group-container";
import { useAddressFields } from "./hooks/useAddressFields";
import { createShipmentCarrierIcon, getFieldName } from "./utils";

type Props = {
  loading: boolean;
  isOpen: boolean;
  disabled?: boolean;
  onToggle: () => void;
  validateItems: (shipmentCarrierId: string) => Promise<any>;
};

export default function ShippingFieldsGroup({
  loading,
  isOpen,
  disabled = false,
  onToggle,
  validateItems,
}: Props) {
  const t = useTranslations("checkout");

  const { dictionary } = useDataContext();
  const { handleShippingCarrierChange } = useCheckoutAnalytics({
    validateItems,
  });

  return (
    <FieldsGroupContainer
      stage="2/3"
      title={t("shipping")}
      disabled={disabled}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <AddressFields loading={loading} disabled={disabled} />
      <div>
        <div className="space-y-4">
          <Text variant="uppercase">{t("shipping method")}</Text>

          <RadioGroupField
            view="card"
            loading={loading}
            name="shipmentCarrierId"
            onChange={handleShippingCarrierChange}
            disabled={disabled}
            // label="shippingMethod"
            // @ts-ignore
            items={dictionary?.shipmentCarriers
              ?.filter((c) => c.shipmentCarrier?.allowed)
              ?.map((c) => ({
                label:
                  t(c.shipmentCarrier?.carrier || "") ||
                  c.shipmentCarrier?.carrier ||
                  "",
                value: c.id + "" || "",
                icon: createShipmentCarrierIcon(
                  c.shipmentCarrier?.carrier || "",
                  Number(c.prices?.[0]?.price?.value) || 0,
                  dictionary.baseCurrency || "",
                ),
              }))}
          />
        </div>
      </div>
    </FieldsGroupContainer>
  );
}

export function AddressFields({
  loading,
  prefix,
  disabled,
}: {
  loading: boolean;
  prefix?: string;
  disabled?: boolean;
}) {
  const { phoneCodeItems, stateItems, countries, handleCountryChange } =
    useAddressFields(prefix);
  const { watch } = useFormContext();
  const t = useTranslations("checkout");

  const countryFieldName = prefix ? `${prefix}.country` : "country";
  const selectedCountry = watch(countryFieldName);

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-1">
          <InputField
            loading={loading}
            variant="secondary"
            name={getFieldName(prefix, "firstName")}
            label={t("first name")}
            disabled={disabled}
            keyboardRestriction={keyboardRestrictions.nameFields}
          />
        </div>
        <div className="col-span-1">
          <InputField
            loading={loading}
            variant="secondary"
            name={getFieldName(prefix, "lastName")}
            label={t("last name")}
            disabled={disabled}
            keyboardRestriction={keyboardRestrictions.nameFields}
          />
        </div>
      </div>

      <AddressAutocomplete
        loading={loading}
        disabled={disabled}
        prefix={prefix}
        countryCode={selectedCountry}
      />

      <SelectField
        loading={loading}
        variant="secondary"
        fullWidth
        name={getFieldName(prefix, "country")}
        label={t("country/region:")}
        items={countries.map((c) => ({
          label: c.name,
          value: c.countryCode,
        }))}
        disabled={disabled}
        onValueChange={handleCountryChange}
      />

      {stateItems.length > 0 && (
        <SelectField
          loading={loading}
          name={getFieldName(prefix, "state")}
          label={t("state:")}
          items={stateItems}
          disabled={disabled}
        />
      )}

      <InputField
        loading={loading}
        variant="secondary"
        name={getFieldName(prefix, "city")}
        label={t("city:")}
        disabled={disabled}
        keyboardRestriction={keyboardRestrictions.nameFields}
      />

      <InputField
        loading={loading}
        variant="secondary"
        name={getFieldName(prefix, "additionalAddress")}
        label={t("additional address:")}
        disabled={disabled}
        keyboardRestriction={keyboardRestrictions.addressField}
      />
      <InputField
        loading={loading}
        variant="secondary"
        name={getFieldName(prefix, "company")}
        label={t("company:")}
        disabled={disabled}
        keyboardRestriction={keyboardRestrictions.companyField}
      />

      <PhoneField
        loading={loading}
        variant="secondary"
        name={getFieldName(prefix, "phone")}
        label={t("phone number:")}
        disabled={disabled}
        items={phoneCodeItems}
      />
      <InputField
        loading={loading}
        variant="secondary"
        name={getFieldName(prefix, "postalCode")}
        label={t("postal code:")}
        disabled={disabled}
        keyboardRestriction={keyboardRestrictions.postalCodeField}
      />
    </>
  );
}
