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
};

export function FormPhoneField({ items, ...rest }: Props) {
  return <PhoneField {...rest} items={items ?? getPhoneCodeSelectItems()} />;
}
