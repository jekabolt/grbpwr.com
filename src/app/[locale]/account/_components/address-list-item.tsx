import type {
  StorefrontAccount,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CheckboxGlobal from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";

import {
  formatAddressDisplayName,
  formatAddressLocation,
  formatAddressStreet,
} from "../utils/address-format";

type AddressListItemProps = {
  address: StorefrontSavedAddress;
  account: StorefrontAccount;
  isDisabled: boolean;
  pending: boolean;
  deletingId: number | null;
  defaultId: number | null;
  defaultOnly: boolean;
  onEdit: (addressId: number) => void;
  onDelete: (addressId: number) => void;
  onSetDefault: (addressId: number) => void;
};

export function AddressListItem({
  address,
  isDisabled,
  account,
  pending,
  deletingId,
  defaultId,
  defaultOnly,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressListItemProps) {
  const t = useTranslations("account");
  const addressId = address.id as number;

  return (
    <div className="space-y-3">
      <div className="leading-none">
        <div className="flex items-center justify-between">
          <Text className={cn({ "text-textInactiveColor": isDisabled })}>
            {formatAddressStreet(address)}
          </Text>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="underline"
              className="uppercase"
              onClick={() => onEdit(addressId)}
              disabled={pending || isDisabled}
            >
              {t("edit")}
            </Button>
            {!defaultOnly && (
              <Button
                type="button"
                variant="underline"
                className="uppercase"
                onClick={() => onDelete(addressId)}
                disabled={pending || deletingId === addressId || isDisabled}
              >
                {t("delete")}
              </Button>
            )}
          </div>
        </div>
        <Text className={cn({ "text-textInactiveColor": isDisabled })}>
          {formatAddressLocation(address)}
        </Text>
        <Text className={cn({ "text-textInactiveColor": isDisabled })}>
          +{account.phone}
        </Text>
      </div>
      <div className="flex items-center justify-between">
        <Text
          variant="uppercase"
          className={cn({ "text-textInactiveColor": isDisabled })}
        >
          {formatAddressDisplayName(address, account)}
        </Text>
        {!defaultOnly && (
          <div className="flex items-center gap-3">
            <Text
              variant="uppercase"
              className={cn({ "text-textInactiveColor": isDisabled })}
            >
              {t("default")}
            </Text>
            <CheckboxGlobal
              name="default"
              checked={address.isDefault}
              onCheckedChange={() => onSetDefault(addressId)}
              disabled={pending || defaultId === addressId || isDisabled}
            />
          </div>
        )}
      </div>
    </div>
  );
}
