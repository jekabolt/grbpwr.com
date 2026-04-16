"use client";

import { useMemo, useState } from "react";
import type { StorefrontAccount } from "@/api/proto-http/frontend";

import { cn, getCountryName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CheckboxGlobal from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";

import { EditAddressForm } from "../_components/edit-address-form";
import { useAddresses } from "../utils/useAddresses";

export function AddressesSection({
  account,
  defaultOnly = false,
  refreshKey,
}: {
  account: StorefrontAccount;
  defaultOnly?: boolean;
  refreshKey?: number;
}) {
  const {
    addresses,
    toastMessage,
    pending,
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

  return (
    <div className="flex w-full flex-col gap-16">
      <Text variant="uppercase">addresses</Text>
      <div className="flex flex-col gap-3">
        {visibleAddresses.map((address) => (
          <div
            key={address.id}
            className={cn("space-y-3 border-b border-textInactiveColor", {
              "border-transparent pb-0": defaultOnly,
              "py-6": address.id && address.id > 0,
            })}
          >
            <div className="leading-none">
              <div className="flex items-center justify-between">
                <Text>
                  {[address.addressLineOne, address.addressLineTwo]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
                <div className="flex items-center gap-3">
                  <Button
                    variant="underline"
                    className="uppercase"
                    onClick={() =>
                      setEditingId(
                        editingId === (address.id as number)
                          ? null
                          : (address.id as number),
                      )
                    }
                    disabled={pending}
                  >
                    {editingId === (address.id as number) ? "cancel" : "edit"}
                  </Button>
                  {!defaultOnly && (
                    <Button
                      variant="underline"
                      className="uppercase"
                      onClick={() => handleDeleteAddress(address.id as number)}
                      disabled={
                        pending || deletingId === (address.id as number)
                      }
                    >
                      delete
                    </Button>
                  )}
                </div>
              </div>
              <Text>
                {[
                  getCountryName(address.country) ?? address.country,
                  address.state,
                  address.city,
                  address.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
              <Text>+{account.phone}</Text>
            </div>
            <div className="flex items-center justify-between">
              <Text variant="uppercase">
                {`${account.firstName?.trim() ?? ""} ${account.lastName?.trim() ?? ""}`.trim() ||
                  address.label ||
                  "address"}
              </Text>
              {!defaultOnly && (
                <div className="flex items-center gap-3">
                  <Text variant="uppercase">default</Text>
                  <CheckboxGlobal
                    name="default"
                    checked={address.isDefault}
                    onCheckedChange={() =>
                      handleDefaultAddress(address.id as number)
                    }
                    disabled={pending || defaultId === (address.id as number)}
                  />
                </div>
              )}
            </div>
            {editingId === (address.id as number) && (
              <EditAddressForm
                address={address}
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
