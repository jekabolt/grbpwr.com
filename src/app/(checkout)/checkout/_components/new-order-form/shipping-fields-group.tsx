"use client";

import { useDataContext } from "@/components/contexts/DataContext";
import InputField from "@/components/ui/form/fields/input-field";
import RadioGroupField from "@/components/ui/form/fields/radio-group-field";
import SelectField from "@/components/ui/form/fields/select-field";
import { Text } from "@/components/ui/text";

import AddressAutocomplete from "./address-autocomplete";
import { countries } from "./constants";
import FieldsGroupContainer from "./fields-group-container";
import { CONTACT_GROUP_FIELDS } from "./hooks/constants";
import { useDisabledGroup } from "./hooks/useFormDisabledGroup";

type Props = {
  loading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  validateItems: (shipmentCarrierId: string) => Promise<any>;
};

export default function ShippingFieldsGroup({
  loading,
  isOpen,
  onToggle,
  validateItems,
}: Props) {
  const { dictionary } = useDataContext();
  const { isGroupDisabled } = useDisabledGroup({
    fields: CONTACT_GROUP_FIELDS,
  });

  return (
    <FieldsGroupContainer
      stage="2/3"
      title="shipping address/delivery method"
      disabled={isGroupDisabled}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <AddressFields loading={loading} disabled={isGroupDisabled} />
      <div>
        <div className="space-y-4">
          <Text variant="uppercase">shipping method</Text>

          <RadioGroupField
            loading={loading}
            name="shipmentCarrierId"
            onChange={validateItems}
            // label="shippingMethod"
            // @ts-ignore
            items={dictionary?.shipmentCarriers?.map((c) => ({
              label: c.shipmentCarrier?.carrier || "",
              value: c.id + "" || "",
            }))}
          />
        </div>
      </div>
    </FieldsGroupContainer>
  );
}

export function AddressFields({
  loading,
  prefix,
  disabled,
}: {
  loading: boolean;
  prefix?: string;
  disabled?: boolean;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-1">
          <InputField
            loading={loading}
            variant="secondary"
            name={prefix ? `${prefix}.firstName` : "firstName"}
            label="first name:"
            disabled={disabled}
          />
        </div>
        <div className="col-span-1">
          <InputField
            loading={loading}
            variant="secondary"
            name={prefix ? `${prefix}.lastName` : "lastName"}
            label="last name:"
            disabled={disabled}
          />
        </div>
      </div>

      <AddressAutocomplete
        loading={loading}
        disabled={disabled}
        prefix={prefix}
      />

      <SelectField
        loading={loading}
        variant="secondary"
        name={prefix ? `${prefix}.country` : "country"}
        label="country/region:"
        items={countries}
        disabled={disabled}
      />

      <SelectField
        loading={loading}
        name={prefix ? `${prefix}.state` : "state"}
        label="state:"
        items={[
          { label: "Sweden", value: "sweden" },
          { label: "Norway", value: "norway" },
          { label: "Denmark", value: "denmark" },
          { label: "Finland", value: "finland" },
          { label: "Iceland", value: "iceland" },
          { label: "Ireland", value: "ireland" },
        ]}
        disabled={disabled}
      />

      <InputField
        loading={loading}
        variant="secondary"
        name={prefix ? `${prefix}.city` : "city"}
        label="city:"
        disabled={disabled}
      />

      <InputField
        loading={loading}
        variant="secondary"
        name={prefix ? `${prefix}.additionalAddress` : "additionalAddress"}
        label="additional address:"
        disabled={disabled}
      />
      <InputField
        loading={loading}
        variant="secondary"
        name={prefix ? `${prefix}.company` : "company"}
        label="company:"
        disabled={disabled}
      />
      <div className="flex gap-2">
        <div className="w-10">
          <SelectField
            loading={loading}
            variant="secondary"
            name={prefix ? `${prefix}.phoneCode` : "phoneCode"}
            label=""
            items={[
              { label: `+375`, value: "+375" },
              { label: `+376`, value: "+376" },
              { label: `+377`, value: "+377" },
            ]}
            disabled={disabled}
          />
        </div>

        <div className="flex-1">
          <InputField
            loading={loading}
            variant="secondary"
            type="number"
            name={prefix ? `${prefix}.phone` : "phone"}
            label="phone number:"
            disabled={disabled}
          />
        </div>
      </div>
      <InputField
        loading={loading}
        variant="secondary"
        name={prefix ? `${prefix}.postalCode` : "postalCode"}
        label="postal code:"
        disabled={disabled}
      />
    </>
  );
}
