"use client";

import { useEffect, useMemo, useState } from "react";
import type { StorefrontAccount } from "@/api/proto-http/frontend";

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
  onEditModeChange,
}: {
  account: StorefrontAccount;
  defaultOnly?: boolean;
  refreshKey?: number;
  isCheckout?: boolean;
  isDisabled?: boolean;
  onEditModeChange?: (isEditing: boolean) => void;
}) {
  const {
    addresses,
    pending,
    loaded,
    toastMessage,
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

  useEffect(() => {
    onEditModeChange?.(editingId !== null);
  }, [editingId, onEditModeChange]);

  const isInitialLoading = pending && !loaded;

  return (
    <div
      className={cn("flex w-full flex-col gap-16", {
        "gap-0": isCheckout,
      })}
    >
      {!isCheckout && (
        <Text
          variant="uppercase"
          className={cn({ "text-textInactiveColor": isDisabled })}
        >
          {editingId !== null ? "edit shipping address" : "addresses"}
        </Text>
      )}
      <div className="flex flex-col gap-3">
        {isInitialLoading ? (
          <AddressesSectionFallback
            defaultOnly={defaultOnly}
            rows={Math.max(1, addresses.length)}
          />
        ) : null}
        {visibleAddresses.map((address) => (
          <div key={address.id}>
            {editingId === null && (
              <div
                className={cn("space-y-3 border-b border-textInactiveColor", {
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
                    setEditingId(editingId === addressId ? null : addressId)
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
                onCancel={() => setEditingId(null)}
                onSuccess={() => {
                  setEditingId(null);
                  void reload();
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
