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
import { useAddresses } from "@/app/[locale]/account/utils/useAddresses";

import AddressAutocomplete from "./address-autocomplete";
import CityAutocomplete from "./city-autocomplete";
import FieldsGroupContainer from "./fields-group-container";
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

export default function ShippingFieldsGroup({
  loading,
  isOpen,
  disabled = false,
  order,
  account,
  onToggle,
}: Props) {
  const t = useTranslations("checkout");
  const { watch, setValue, getValues, trigger } = useFormContext();
  const { dictionary } = useDataContext();
  const { currentCountry } = useTranslationsStore((s) => s);
  const { isSignedIn } = useAccountOnboardingStore((s) => s);
  const { handleShippingCarrierChange } = useCheckoutAnalytics();

  const [saveAddressLabel, setSaveAddressLabel] = useState("");
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressSaveStatus, setAddressSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const currency =
    currentCountry.currencyKey || dictionary?.baseCurrency || "EUR";
  const selectedCountry = watch("country");
  const selectedShipmentCarrierId = watch("shipmentCarrierId");
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
      !eligibleCarrierIds.includes(selectedShipmentCarrierId)
    ) {
      setValue("shipmentCarrierId", "");
    }
  }, [
    selectedCountry,
    selectedShipmentCarrierId,
    eligibleCarrierIds,
    setValue,
  ]);

  const [savedAddressesRefreshKey, setSavedAddressesRefreshKey] = useState(0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const { addresses, defaultAddress, loaded } = useAddresses({
    enabled: isSignedIn,
    refreshKey: savedAddressesRefreshKey,
  });

  const showAddressForm =
    !isSignedIn || (loaded && !addresses.length) || isAddingNewAddress;
  const showSavedAddressesSelector =
    isSignedIn && loaded && addresses.length > 0 && !isAddingNewAddress;

  function resetAddressFields() {
    const keys: Array<
      | "state"
      | "city"
      | "address"
      | "additionalAddress"
      | "company"
      | "phone"
      | "postalCode"
      | "savedAddressId"
    > = [
      "state",
      "city",
      "address",
      "additionalAddress",
      "company",
      "phone",
      "postalCode",
      "savedAddressId",
    ];
    keys.forEach((k) =>
      setValue(k, "", { shouldValidate: false, shouldDirty: false }),
    );
    setValue("country", currentCountry.countryCode ?? "", {
      shouldValidate: false,
      shouldDirty: false,
    });
  }

  function handleAddNewAddress() {
    setAddressSaveStatus(null);
    setSaveAddressLabel("");
    setSaveAsDefault(false);
    resetAddressFields();
    setIsAddingNewAddress(true);
  }

  function handleCancelAddNewAddress() {
    setAddressSaveStatus(null);
    setIsAddingNewAddress(false);

    // Restore whichever saved address was active before the user opened the form.
    const currentSavedId = getValues("savedAddressId");
    const target = currentSavedId
      ? addresses.find((a) => String(a.id ?? "") === currentSavedId)
      : defaultAddress;
    const addr = target ?? defaultAddress;
    if (!addr) return;

    setValue("savedAddressId", String(addr.id ?? ""), {
      shouldValidate: false,
    });
    setValue("country", (addr.country ?? "").trim().toLowerCase(), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("state", (addr.state ?? "").trim(), {
      shouldValidate: false,
      shouldDirty: true,
    });
    setValue("city", (addr.city ?? "").trim(), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("address", (addr.addressLineOne ?? "").trim(), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("additionalAddress", (addr.addressLineTwo ?? "").trim(), {
      shouldValidate: false,
      shouldDirty: true,
    });
    setValue("company", (addr.company ?? "").trim(), {
      shouldValidate: false,
      shouldDirty: true,
    });
    setValue("postalCode", (addr.postalCode ?? "").trim(), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  async function handleSaveAddress() {
    setAddressSaveStatus(null);

    const requiredShippingFields: Array<
      "firstName" | "lastName" | "country" | "city" | "address" | "postalCode"
    > = ["firstName", "lastName", "country", "city", "address", "postalCode"];
    const valid = await trigger(requiredShippingFields);
    if (!valid) {
      setAddressSaveStatus({
        type: "error",
        message: "fill required shipping fields before saving address",
      });
      return;
    }

    const values = getValues();
    const autoLabel =
      `${values.firstName?.trim() ?? ""} ${values.lastName?.trim() ?? ""}`.trim() ||
      "My address";

    setIsSavingAddress(true);
    try {
      const addRes = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: {
            label: saveAddressLabel.trim() || autoLabel,
            country: values.country?.trim(),
            state: values.state?.trim() || "",
            city: values.city?.trim(),
            addressLineOne: values.address?.trim(),
            addressLineTwo: values.additionalAddress?.trim() || "",
            company: values.company?.trim() || "",
            postalCode: values.postalCode?.trim(),
            isDefault: saveAsDefault,
          },
        }),
      });

      const addData = await addRes.json().catch(() => ({}));
      if (!addRes.ok) {
        setAddressSaveStatus({
          type: "error",
          message:
            typeof addData?.error === "string"
              ? addData.error
              : "failed to save address",
        });
        return;
      }

      if (saveAsDefault && typeof addData?.id === "number") {
        await fetch(`/api/account/addresses/${addData.id}/default`, {
          method: "POST",
        });
        setValue("savedAddressId", String(addData.id), {
          shouldValidate: false,
        });
      }

      setSavedAddressesRefreshKey((k) => k + 1);

      setAddressSaveStatus({
        type: "success",
        message: "address saved",
      });
      setIsAddingNewAddress(false);
      setSaveAddressLabel("");
      setSaveAsDefault(false);
    } finally {
      setIsSavingAddress(false);
    }
  }

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

          {isSignedIn && (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="main"
                size="lg"
                className="w-full uppercase"
                disabled={disabled || loading || isSavingAddress}
                loading={isSavingAddress}
                onClick={handleSaveAddress}
              >
                save address
              </Button>
              {isAddingNewAddress && addresses.length > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full uppercase"
                  disabled={disabled || loading || isSavingAddress}
                  onClick={handleCancelAddNewAddress}
                >
                  cancel
                </Button>
              )}
            </div>
          )}
        </>
      )}
      {showSavedAddressesSelector && (
        <CheckoutSavedAddressSelector
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
    </FieldsGroupContainer>
  );
}

const sortedCountries = getSortedCountries();

export function AddressFields({
  loading,
  prefix,
  disabled,
}: {
  loading: boolean;
  prefix?: string;
  disabled?: boolean;
}) {
  const { stateItems, handleCountryChange } = useAddressFields(prefix);
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

      <FormPhoneField
        loading={loading}
        variant="secondary"
        name={getFieldName(prefix, "phone")}
        label={t("phone number:")}
        disabled={disabled}
        selectedCountry={selectedCountry}
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
