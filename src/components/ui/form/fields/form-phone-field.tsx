"use client";

import {
  getPhoneCodeSelectItems,
  type PhoneCodeSelectItem,
} from "@/lib/phone/phone-code-items";
import {
  PhoneField,
  type PhoneFieldProps,
} from "@/components/ui/form/fields/phone-field";

type Props = Omit<PhoneFieldProps, "items"> & {
  items?: PhoneCodeSelectItem[];
  optional?: boolean;
};

export function FormPhoneField({ items, optional, ...rest }: Props) {
  return (
    <PhoneField
      {...rest}
      items={items ?? getPhoneCodeSelectItems()}
      optional={optional}
    />
  );
}
