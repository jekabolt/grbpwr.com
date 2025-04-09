"use client";

import { useDataContext } from "@/components/contexts/DataContext";
import InputField from "@/components/ui/form/fields/input-field";
import RadioGroupField from "@/components/ui/form/fields/radio-group-field";
import SelectField from "@/components/ui/form/fields/select-field";
import { Text } from "@/components/ui/text";

import { countries } from "./constants";
import FieldsGroupContainer from "./fields-group-container";
import { CONTACT_GROUP_FIELDS } from "./hooks/constants";
import { useDisabledGroup } from "./hooks/useFormDisabledGroup";

type Props = {
  loading: boolean;
  validateItems: (shipmentCarrierId: string) => Promise<any>;
};

export default function ShippingFieldsGroup({ loading, validateItems }: Props) {
  const { dictionary } = useDataContext();
  const { isGroupDisabled } = useDisabledGroup({
    fields: CONTACT_GROUP_FIELDS,
  });

  return (
    <FieldsGroupContainer
      stage="2/3"
      title="shipping address/delivery method"
      disabled={isGroupDisabled}
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
            name={prefix ? `${prefix}.firstName` : "firstName"}
            label="first name:"
            placeholder="James"
            disabled={disabled}
          />
        </div>
        <div className="col-span-1">
          <InputField
            loading={loading}
            name={prefix ? `${prefix}.lastName` : "lastName"}
            label="last name:"
            placeholder="Bond"
            disabled={disabled}
          />
        </div>
      </div>
      <SelectField
        loading={loading}
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
        name={prefix ? `${prefix}.city` : "city"}
        label="city:"
        placeholder="London"
        disabled={disabled}
      />
      <InputField
        loading={loading}
        name={prefix ? `${prefix}.address` : "address"}
        label="street and house number:"
        placeholder="sjyrniesu 10"
        disabled={disabled}
      />
      <InputField
        loading={loading}
        name={prefix ? `${prefix}.additionalAddress` : "additionalAddress"}
        label="additional address:"
        placeholder=""
        disabled={disabled}
      />
      <InputField
        loading={loading}
        name={prefix ? `${prefix}.company` : "company"}
        label="company:"
        placeholder="Channel"
        disabled={disabled}
      />
      <InputField
        loading={loading}
        name={prefix ? `${prefix}.postalCode` : "postalCode"}
        label="postal code:"
        placeholder="37892"
        disabled={disabled}
      />
    </>
  );
}
