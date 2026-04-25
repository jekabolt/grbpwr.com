"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  StorefrontAccount,
  ValidateOrderItemsInsertResponse,
} from "@/api/proto-http/frontend";
import { currencySymbols, keyboardRestrictions } from "@/constants";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { formatPrice } from "@/lib/currency";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { FormPhoneField } from "@/components/ui/form/fields/form-phone-field";
import InputField from "@/components/ui/form/fields/input-field";
import RadioGroupField from "@/components/ui/form/fields/radio-group-field";
import SelectField from "@/components/ui/form/fields/select-field";
import { Text } from "@/components/ui/text";
import { CheckoutSavedAddressSelector } from "@/app/[locale]/account/_components/checkout-saved-address-selector";
import { useAddresses } from "@/app/[locale]/account/utils/use-addresses";

import AddressAutocomplete from "./address-autocomplete";
import CityAutocomplete from "./city-autocomplete";
import FieldsGroupContainer from "./fields-group-container";
import { useAddNewAddress } from "./hooks/useAddNewAddress";
import { useAddressFields } from "./hooks/useAddressFields";
import {
  getCarrierPriceForCurrency,
  getFieldName,
  getShippingRegionForCountry,
  getSortedCountries,
  isCarrierEligibleForRegion,
} from "./utils";

type Props = {
  loading: boolean;
  isOpen: boolean;
  disabled?: boolean;
  order?: ValidateOrderItemsInsertResponse;
  account?: StorefrontAccount;
  onToggle: () => void;
};

const SHIPPING_ADDRESS_REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "country",
  "city",
  "address",
  "postalCode",
  "phone",
];

function hasValue(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

export default function ShippingFieldsGroup({
  loading,
  isOpen,
  disabled = false,
  order,
  account,
  onToggle,
}: Props) {
  const t = useTranslations("checkout");
  const { watch, setValue } = useFormContext();
  const { dictionary } = useDataContext();
  const { currentCountry } = useTranslationsStore((s) => s);
  const { isSignedIn } = useAccountOnboardingStore((s) => s);
  const { handleShippingCarrierChange } = useCheckoutAnalytics();

  const currency =
    currentCountry.currencyKey || dictionary?.baseCurrency || "EUR";
  const selectedCountry = watch("country");
  const selectedShipmentCarrierId = watch("shipmentCarrierId");
  const shippingAddressValues = watch(SHIPPING_ADDRESS_REQUIRED_FIELDS);
  const hasFilledAddress = shippingAddressValues.every(hasValue);
  const region = getShippingRegionForCountry(selectedCountry || "");

  const eligibleCarriers = useMemo(
    () =>
      dictionary?.shipmentCarriers?.filter(
        (c) =>
          c.shipmentCarrier?.allowed && isCarrierEligibleForRegion(c, region),
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
      (!hasFilledAddress ||
        !eligibleCarrierIds.includes(selectedShipmentCarrierId))
    ) {
      setValue("shipmentCarrierId", "");
    }
  }, [
    hasFilledAddress,
    selectedCountry,
    selectedShipmentCarrierId,
    eligibleCarrierIds,
    setValue,
  ]);

  const [savedAddressesRefreshKey, setSavedAddressesRefreshKey] = useState(0);
  const {
    isAddingNewAddress,
    savingNewAddress,
    saveAddressError,
    handleAddNewAddress,
    handleCancelAddNewAddress,
    handleSaveNewAddress,
  } = useAddNewAddress({
    defaultCountryCode: currentCountry.countryCode,
    onSaved: () => {
      setSavedAddressesRefreshKey((k) => k + 1);
    },
  });

  const { addresses, loaded } = useAddresses({
    enabled: isSignedIn,
    refreshKey: savedAddressesRefreshKey,
  });

  const showAddressForm =
    !isSignedIn || (loaded && !addresses.length) || isAddingNewAddress;
  const showSavedAddressesSelector =
    isSignedIn && loaded && addresses.length > 0 && !isAddingNewAddress;
  const shouldShowSaveAddressActions =
    isSignedIn && (isAddingNewAddress || (loaded && addresses.length === 0));

  return (
    <FieldsGroupContainer
      stage="2/3"
      title={t("shipping")}
      disabled={disabled}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {showAddressForm && (
        <>
          <AddressFields loading={loading} disabled={disabled} />
          {shouldShowSaveAddressActions && (
            <div className="mt-4 flex gap-3">
              <Button
                type="button"
                variant="main"
                size="lg"
                className="w-full uppercase"
                disabled={disabled || loading || savingNewAddress}
                loading={savingNewAddress}
                onClick={handleSaveNewAddress}
              >
                save
              </Button>
              {isAddingNewAddress ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full uppercase"
                  disabled={disabled || loading || savingNewAddress}
                  onClick={handleCancelAddNewAddress}
                >
                  cancel
                </Button>
              ) : null}
            </div>
          )}
        </>
      )}
      {showSavedAddressesSelector && (
        <CheckoutSavedAddressSelector
          isCheckout={true}
          loading={loading}
          disabled={disabled}
          defaultOnly={true}
          isSignedIn={isSignedIn}
          refreshKey={savedAddressesRefreshKey}
          account={account as StorefrontAccount}
          onDefaultChange={() => {
            setSavedAddressesRefreshKey((k) => k + 1);
          }}
          onAddNewAddress={handleAddNewAddress}
        />
      )}
      {hasFilledAddress && (
        <div>
          <div className="space-y-4">
            <Text
              variant="uppercase"
              className={cn("", {
                "text-textInactiveColor": disabled || loading,
              })}
            >
              {t("shipping method")}
            </Text>

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
                  const displayCarrierName =
                    carrierName === "FREE" ? t("FREE") : carrierName;
                  const price = getCarrierPriceForCurrency(c, currency);
                  const symbol = currencySymbols[currency] || currency;
                  const formattedPrice = price
                    ? formatPrice(Number(price), currency, symbol)
                    : "";
                  const label =
                    eta && eta !== "-"
                      ? `${displayCarrierName} (${eta} ${t("business days")})`
                      : displayCarrierName;
                  const promoFreeShipping = !!order?.promo?.freeShipping;
                  const orderFreeShipping = !!order?.freeShipping;
                  const freeShipping = promoFreeShipping || orderFreeShipping;
                  return {
                    label,
                    value: c.id + "" || "",
                    priceLabel: formattedPrice || undefined,
                    priceLabelStrikethrough: freeShipping && !!formattedPrice,
                  };
                })}
              />
            )}
          </div>
        </div>
      )}
    </FieldsGroupContainer>
  );
}

const sortedCountries = getSortedCountries();

export function AddressFields({
  loading,
  prefix,
  disabled,
  showNameFields = true,
  showPhoneField = true,
}: {
  loading: boolean;
  prefix?: string;
  disabled?: boolean;
  showNameFields?: boolean;
  showPhoneField?: boolean;
}) {
  const { stateItems, handleCountryChange } = useAddressFields(prefix);
  const { watch } = useFormContext();
  const t = useTranslations("checkout");

  const countryFieldName = prefix ? `${prefix}.country` : "country";
  const selectedCountry = watch(countryFieldName);

  return (
    <>
      {showNameFields && (
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
      )}

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
        items={sortedCountries}
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

      <CityAutocomplete
        loading={loading}
        disabled={disabled}
        prefix={prefix}
        countryCode={selectedCountry}
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

      {showPhoneField && (
        <FormPhoneField
          loading={loading}
          variant="secondary"
          name={getFieldName(prefix, "phone")}
          label={t("phone number:")}
          disabled={disabled}
          selectedCountry={selectedCountry}
        />
      )}
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
