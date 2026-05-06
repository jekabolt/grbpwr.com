"use client";

import { useEffect, useMemo, useState } from "react";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { AddressListItem } from "../_components/address-list-item";
import { EditAddressForm } from "../_components/edit-address-form";
import { AddressesSectionFallback } from "../_components/section-fallbacks";
import { useAddresses } from "../utils/use-addresses";

export function AddressesSection({
  account,
  defaultOnly = false,
  refreshKey,
  isCheckout,
  isDisabled,
  editResetKey,
  onEditModeChange,
}: {
  account: StorefrontAccount;
  defaultOnly?: boolean;
  refreshKey?: number;
  isCheckout?: boolean;
  isDisabled?: boolean;
  editResetKey?: number;
  onEditModeChange?: (isEditing: boolean) => void;
}) {
  const t = useTranslations("account");
  const {
    addresses,
    pending,
    loaded,
    defaultId,
    deletingId,
    handleDefaultAddress,
    handleDeleteAddress,
    reload,
  } = useAddresses({ refreshKey });

  const [editingId, setEditingId] = useState<number | null>(null);

  const visibleAddresses = useMemo(() => {
    if (!defaultOnly) return addresses;
    return addresses.filter((address) => address.isDefault);
  }, [addresses, defaultOnly]);

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

  return (
    <div
      className={cn("flex w-full flex-col gap-16", {
        "gap-0": isCheckout,
      })}
    >
      {editingId === null && (
        <Text
          variant="uppercase"
          className={cn("hidden lg:block", {
            "text-textInactiveColor": isDisabled,
          })}
        >
          {t("addresses")}
        </Text>
      )}
      {isInitialLoading ? (
        <AddressesSectionFallback
          defaultOnly={defaultOnly}
          rows={addresses.length || (defaultOnly ? 1 : undefined)}
        />
      ) : addresses.length > 0 ? (
        <div className="flex flex-col">
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
        <div className="flex flex-col gap-6">
          <Text variant="uppercase">{t("no addresses saved")}</Text>
          <Text>{t("save an address to faster checkout")}</Text>
        </div>
      )}
    </div>
  );
}
