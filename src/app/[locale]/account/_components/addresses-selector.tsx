import {
  StorefrontAccount,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";
import * as RadixSelect from "@radix-ui/react-select";

import { cn } from "@/lib/utils";
import { Arrow } from "@/components/ui/icons/arrow";
import { Text } from "@/components/ui/text";

import { buildAddressTextValue } from "../utils/address-format";
import { AddressFullDetails } from "./addresse-details";

export function AddressesSelector({
  savedAddressId,
  open,
  isDisabled,
  // selectedAddress,
  addresses,
  account,
  handleValueChange,
  setOpen,
}: {
  savedAddressId: string;
  open: boolean;
  isDisabled: boolean;
  // selectedAddress: StorefrontSavedAddress | undefined;
  addresses: StorefrontSavedAddress[];
  account: StorefrontAccount;
  handleValueChange: (value: string) => void;
  setOpen: (open: boolean) => void;
}) {
  return (
    <RadixSelect.Root
      value={savedAddressId ?? ""}
      onValueChange={handleValueChange}
      open={open}
      onOpenChange={setOpen}
      disabled={isDisabled}
    >
      <RadixSelect.Trigger
        className={cn(
          "flex w-full items-center justify-between gap-2 border-b border-textColor bg-bgColor text-left text-textBaseSize focus:outline-none focus:ring-0 disabled:border-textInactiveColor disabled:text-textInactiveColor",
        )}
        aria-label="select saved address"
      >
        <RadixSelect.Icon
          className={cn("shrink-0 rotate-180 text-textColor", {
            "rotate-0": open,
            "text-textInactiveColor": isDisabled,
          })}
        >
          <Arrow />
        </RadixSelect.Icon>
        <Text
          variant="uppercase"
          className="min-w-0 flex-1 truncate text-center"
        >
          use other address
        </Text>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          className="z-[100] overflow-hidden border border-textInactiveColor bg-bgColor"
          style={{ width: "var(--radix-select-trigger-width)" }}
        >
          <RadixSelect.Viewport className="max-h-[360px] bg-bgColor">
            {addresses.map((address) => (
              <RadixSelect.Item
                key={address.id}
                value={String(address.id ?? "")}
                textValue={buildAddressTextValue(address)}
                className={cn(
                  "relative flex select-none flex-col gap-2 border-b border-textInactiveColor px-3 py-3 last:border-b-0 data-[disabled]:pointer-events-none data-[highlighted]:bg-[rgba(0,0,0,0.08)] data-[highlighted]:text-textColor data-[disabled]:opacity-30 data-[highlighted]:outline-none",
                  {
                    "bg-textInactiveColor": address.isDefault,
                  },
                )}
              >
                <RadixSelect.ItemText>
                  <Text className="sr-only">
                    {buildAddressTextValue(address)}
                  </Text>
                </RadixSelect.ItemText>
                <AddressFullDetails address={address} account={account} />
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
