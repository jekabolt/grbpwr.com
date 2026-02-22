"use client";

import { useEffect, useMemo } from "react";
import { keyboardRestrictions, currencySymbols } from "@/constants";
import { formatPrice } from "@/lib/currency";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import InputField from "@/components/ui/form/fields/input-field";
import { PhoneField } from "@/components/ui/form/fields/phone-field";
import RadioGroupField from "@/components/ui/form/fields/radio-group-field";
import SelectField from "@/components/ui/form/fields/select-field";
import { Text } from "@/components/ui/text";

import AddressAutocomplete from "./address-autocomplete";
import FieldsGroupContainer from "./fields-group-container";
import { useAddressFields } from "./hooks/useAddressFields";
import {
  getCarrierPriceForCurrency,
  getFieldName,
  getShippingRegionForCountry,
  isCarrierEligibleForRegion,
} from "./utils";

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
  const { watch, setValue } = useFormContext();
  const { dictionary } = useDataContext();
  const { currentCountry } = useTranslationsStore((s) => s);
  const { handleShippingCarrierChange } = useCheckoutAnalytics();

  const currency =
    currentCountry.currencyKey || dictionary?.baseCurrency || "EUR";
  const selectedCountry = watch("country");
  const selectedShipmentCarrierId = watch("shipmentCarrierId");
  const region = getShippingRegionForCountry(selectedCountry || "");

  const eligibleCarriers = useMemo(
    () =>
      dictionary?.shipmentCarriers?.filter(
        (c) =>
          c.shipmentCarrier?.allowed &&
          isCarrierEligibleForRegion(c, region),
      ) ?? [],
    [dictionary?.shipmentCarriers, region],
  );

  const eligibleCarrierIds = useMemo(
    () => eligibleCarriers.map((c) => c.id + ""),
    [eligibleCarriers],
  );

  useEffect(() => {
    if (
      selectedShipmentCarrierId &&
      !eligibleCarrierIds.includes(selectedShipmentCarrierId)
    ) {
      setValue("shipmentCarrierId", "");
    }
  }, [selectedCountry, selectedShipmentCarrierId, eligibleCarrierIds, setValue]);

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

          {eligibleCarriers.length === 0 ? (
            <Text variant="inactive">
              {region
                ? t("no shipping options for location")
                : t("select country to see shipping options")}
            </Text>
          ) : (
            <RadioGroupField
              view="card"
              loading={loading}
              name="shipmentCarrierId"
              onChange={handleShippingCarrierChange}
              disabled={disabled}
              // @ts-ignore
              items={eligibleCarriers.map((c) => {
                const carrierName = c.shipmentCarrier?.carrier || "";
                const eta = c.shipmentCarrier?.expectedDeliveryTime;
                const price = getCarrierPriceForCurrency(c, currency);
                const symbol = currencySymbols[currency] || currency;
                const formattedPrice = price
                  ? formatPrice(Number(price), currency, symbol)
                  : "";
                const namePart = eta
                  ? `${t(carrierName) || carrierName} (${eta})`
                  : t(carrierName) || carrierName;
                const label = formattedPrice
                  ? `${namePart} — ${formattedPrice}`
                  : namePart;
                return {
                  label,
                  value: c.id + "" || "",
                };
              })}
            />
          )}
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
