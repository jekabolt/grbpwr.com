"use client";

import { common_Dictionary } from "@/api/proto-http/frontend";
import { COUNTRIES_BY_REGION, keyboardRestrictions } from "@/constants";
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
import { createShipmentCarrierIcon } from "./utils";

type Props = {
  loading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  validateItems: (shipmentCarrierId: string) => Promise<any>;
  disabled?: boolean;
};

export default function ShippingFieldsGroup({
  loading,
  isOpen,
  onToggle,
  validateItems,
  disabled = false,
}: Props) {
  const { dictionary } = useDataContext();
  const t = useTranslations("checkout");
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
      summary={<Summary dictionary={dictionary} />}
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
                  Number(c.shipmentCarrier?.price?.value) || 0,
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
  const t = useTranslations("checkout");

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-1">
          <InputField
            loading={loading}
            variant="secondary"
            name={prefix ? `${prefix}.firstName` : "firstName"}
            label={t("first name")}
            disabled={disabled}
            keyboardRestriction={keyboardRestrictions.nameFields}
          />
        </div>
        <div className="col-span-1">
          <InputField
            loading={loading}
            variant="secondary"
            name={prefix ? `${prefix}.lastName` : "lastName"}
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
      />

      <SelectField
        loading={loading}
        variant="secondary"
        fullWidth
        name={prefix ? `${prefix}.country` : "country"}
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
          name={prefix ? `${prefix}.state` : "state"}
          label={t("state:")}
          items={stateItems}
          disabled={disabled}
        />
      )}

      <InputField
        loading={loading}
        variant="secondary"
        name={prefix ? `${prefix}.city` : "city"}
        label={t("city:")}
        disabled={disabled}
        keyboardRestriction={keyboardRestrictions.nameFields}
      />

      <InputField
        loading={loading}
        variant="secondary"
        name={prefix ? `${prefix}.additionalAddress` : "additionalAddress"}
        label={t("additional address:")}
        disabled={disabled}
        keyboardRestriction={keyboardRestrictions.addressField}
      />
      <InputField
        loading={loading}
        variant="secondary"
        name={prefix ? `${prefix}.company` : "company"}
        label={t("company:")}
        disabled={disabled}
        keyboardRestriction={keyboardRestrictions.companyField}
      />

      <PhoneField
        loading={loading}
        variant="secondary"
        name={prefix ? `${prefix}.phone` : "phone"}
        label={t("phone number:")}
        disabled={disabled}
        items={phoneCodeItems}
      />
      <InputField
        loading={loading}
        variant="secondary"
        name={prefix ? `${prefix}.postalCode` : "postalCode"}
        label={t("postal code:")}
        disabled={disabled}
        keyboardRestriction={keyboardRestrictions.postalCodeField}
      />
    </>
  );
}

function Summary({
  dictionary,
  className,
}: {
  dictionary?: common_Dictionary;
  className?: string;
}) {
  const t = useTranslations("checkout");
  const { watch } = useFormContext();
  const {
    firstName,
    lastName,
    company,
    address,
    additionalAddress,
    city,
    state,
    country,
    postalCode,
    phone,
    shipmentCarrierId,
  } = watch();

  const name = [firstName, lastName].filter(Boolean).join(" ");
  const countries = Object.values(COUNTRIES_BY_REGION).flat();
  const phoneOrCompany = [phone && `+${phone}`, company]
    .filter(Boolean)
    .join(" ");
  const addressLine = [address, additionalAddress].filter(Boolean).join(" ");
  const countryInfo = [
    city,
    state,
    countries.find((c) => c.countryCode === country)?.name,
    postalCode,
  ]
    .filter(Boolean)
    .join(" ");
  const shipmentCarrier = dictionary?.shipmentCarriers?.find(
    (c) => c.id?.toString() === shipmentCarrierId,
  )?.shipmentCarrier?.carrier;

  if (
    !name &&
    !phoneOrCompany &&
    !addressLine &&
    !shipmentCarrier &&
    !countryInfo
  )
    return null;

  return (
    <div className={className}>
      {name && <Text>{name}</Text>}
      {phoneOrCompany && <Text>{phoneOrCompany}</Text>}
      {addressLine && <Text>{addressLine}</Text>}
      {countryInfo && <Text>{countryInfo}</Text>}
      {shipmentCarrier && (
        <Text variant="uppercase">
          {t("shipping summary")}: {shipmentCarrier}
        </Text>
      )}
    </div>
  );
}
