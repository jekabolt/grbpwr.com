"use client";

import type { Control } from "react-hook-form";

import { useDataContext } from "@/components/DataContext";
import InputField from "@/components/ui/form/fields/input-field";
import RadioGroupField from "@/components/ui/form/fields/radio-group-field";
import SelectField from "@/components/ui/form/fields/select-field";
import { Text } from "@/components/ui/text";

import { countries } from "./constants";
import FieldsGroupContainer from "./fields-group-container";

type Props = {
  loading: boolean;
  control: Control<any>;
  validateItemsAndUpdateCookie: (shipmentCarrierId: string) => Promise<any>;
};

export default function ShippingFieldsGroup({
  loading,
  control,
  validateItemsAndUpdateCookie,
}: Props) {
  const { dictionary } = useDataContext();

  return (
    <FieldsGroupContainer stage="2/3" title="shipping address/delivery method">
      <AddressFields loading={loading} control={control} />
      <div>
        <div className="space-y-4">
          <Text variant="uppercase">shipping method</Text>

          <RadioGroupField
            control={control}
            loading={loading}
            name="shipmentCarrierId"
            onChange={validateItemsAndUpdateCookie}
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
  control,
  prefix,
}: {
  loading: boolean;
  control: Control<any>;
  prefix?: string;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-1">
          <InputField
            control={control}
            loading={loading}
            name={prefix ? `${prefix}.firstName` : "firstName"}
            label="first name:"
            placeholder="James"
          />
        </div>
        <div className="col-span-1">
          <InputField
            control={control}
            loading={loading}
            name={prefix ? `${prefix}.lastName` : "lastName"}
            label="last name:"
            placeholder="Bond"
          />
        </div>
      </div>
      <SelectField
        control={control}
        loading={loading}
        name={prefix ? `${prefix}.country` : "country"}
        label="country/region:"
        items={countries}
      />

      <SelectField
        control={control}
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
      />

      <InputField
        control={control}
        loading={loading}
        name={prefix ? `${prefix}.city` : "city"}
        label="city:"
        placeholder="London"
      />
      <InputField
        control={control}
        loading={loading}
        name={prefix ? `${prefix}.address` : "address"}
        label="street and house number:"
        placeholder="sjyrniesu 10"
      />
      <InputField
        control={control}
        loading={loading}
        name={prefix ? `${prefix}.additionalAddress` : "additionalAddress"}
        label="additional address:"
        placeholder=""
      />
      <InputField
        control={control}
        loading={loading}
        name={prefix ? `${prefix}.company` : "company"}
        label="company:"
        placeholder="Channel"
      />
      <InputField
        control={control}
        loading={loading}
        name={prefix ? `${prefix}.postalCode` : "postalCode"}
        label="postal code:"
        placeholder="37892"
      />
    </>
  );
}
