"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import { AddressListItem } from "../_components/address-list-item";
import { EditAddressForm } from "../_components/edit-address-form";
import { AddressesSectionFallback } from "../_components/section-fallbacks";
import { useAddresses, type UseAddressesResult } from "../utils/use-addresses";

const SECTION_CLASSNAME = "flex h-full min-h-0 w-full flex-col";
const LIST_CLASSNAME =
  "flex min-h-0 flex-1 flex-col overflow-y-auto bg-bgColor lg:pt-16 text-textColor";

export function AddressesSection({
  account,
  defaultOnly = false,
  shared,
  refreshKey,
  countryCode,
  isCheckout,
  isDisabled,
  editResetKey,
  onEditModeChange,
}: {
  account: StorefrontAccount;
  defaultOnly?: boolean;
  /** Pass from checkout parent to avoid a duplicate addresses fetch. */
  shared?: UseAddressesResult;
  refreshKey?: number;
  countryCode?: string;
  isCheckout?: boolean;
  isDisabled?: boolean;
  editResetKey?: number;
  onEditModeChange?: (isEditing: boolean) => void;
}) {
  const t = useTranslations("account");
  const internal = useAddresses({
    refreshKey,
    countryCode: shared ? undefined : countryCode,
    enabled: !shared,
  });

  const {
    addresses,
    pending,
    loaded,
    checkoutAddress,
    defaultId,
    deletingId,
    handleDefaultAddress,
    handleDeleteAddress,
    reload,
    toastMessage,
    toastOpen,
    setToastOpen,
  } = shared ?? internal;

  const [editingId, setEditingId] = useState<number | null>(null);

  const visibleAddresses = useMemo(() => {
    // Checkout: only show an address that matches the browsing country.
    // Do not fall back to the global account default (e.g. PL on jp/en).
    if (defaultOnly) {
      return checkoutAddress ? [checkoutAddress] : [];
    }
    if (!defaultOnly) return addresses;
    return addresses.filter((address) => address.isDefault);
  }, [addresses, checkoutAddress, defaultOnly]);

  function setAddressEditingId(nextId: number | null) {
    setEditingId(nextId);
    onEditModeChange?.(nextId !== null);
  }

  useEffect(() => {
    if (editResetKey === undefined) return;
    setEditingId(null);
    onEditModeChange?.(false);
  }, [editResetKey, onEditModeChange]);

  const isInitialLoading = !loaded;

  const rootClassName = cn(
    "flex w-full flex-col",
    isCheckout ? "gap-16" : SECTION_CLASSNAME,
    { "gap-0": isCheckout },
  );
  const listClassName = isCheckout ? "flex flex-col" : LIST_CLASSNAME;

  return (
    <>
      <div className={rootClassName}>
        {editingId === null && (
          <Text
            variant="uppercase"
            className={cn("hidden shrink-0 lg:block", {
              "text-textInactiveColor": isDisabled,
            })}
          >
            {t("addresses")}
          </Text>
        )}
        {isInitialLoading ? (
          <div className={listClassName}>
            <AddressesSectionFallback
              defaultOnly={defaultOnly}
              rows={addresses.length || (defaultOnly ? 1 : undefined)}
            />
          </div>
        ) : addresses.length > 0 ? (
          <div className={listClassName}>
            {visibleAddresses.map((address) => (
              <div key={address.id}>
                {editingId === null && (
                  <div
                    className={cn("border-b border-textInactiveColor", {
                      "border-transparent pb-0": defaultOnly,
                      "py-6": (address.id ?? 0) > 0,
                      "border-none": visibleAddresses.length === 1,
                    })}
                  >
                    <AddressListItem
                      address={address}
                      account={account}
                      isDisabled={isDisabled ?? false}
                      pending={pending}
                      deletingId={deletingId}
                      defaultId={defaultId}
                      defaultOnly={defaultOnly}
                      onEdit={(addressId) =>
                        setAddressEditingId(
                          editingId === addressId ? null : addressId,
                        )
                      }
                      onDelete={handleDeleteAddress}
                      onSetDefault={handleDefaultAddress}
                    />
                  </div>
                )}
                {editingId === (address.id as number) && (
                  <EditAddressForm
                    address={address}
                    account={account}
                    isCheckout={isCheckout}
                    onCancel={() => setAddressEditingId(null)}
                    onSuccess={() => {
                      setAddressEditingId(null);
                      void reload();
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={listClassName}>
            <div className="flex flex-col gap-6">
              <Text variant="uppercase">{t("no addresses saved")}</Text>
              <Text>{t("save an address to faster checkout")}</Text>
              <Button
                size={"lg"}
                variant="simpleReverseWithBorder"
                className="self-start uppercase"
                asChild
              >
                <Link href="/catalog">{t("explore collections")}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      {toastMessage && (
        <SubmissionToaster
          open={toastOpen}
          message={toastMessage}
          onOpenChange={setToastOpen}
        />
      )}
    </>
  );
}
