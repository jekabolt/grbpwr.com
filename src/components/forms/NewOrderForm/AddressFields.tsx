"use client";

import InputField from "@/components/ui/form/fields/InputField";
import SelectField from "@/components/ui/form/fields/SelectField";
import type { Control } from "react-hook-form";

type Props = {
  loading: boolean;
  control: Control<any>;
  prefix?: string;
};

export default function AddressFields({ loading, control, prefix }: Props) {
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
        items={[
          { label: "Sweden", value: "sweden" },
          { label: "Norway", value: "norway" },
          { label: "Denmark", value: "denmark" },
          { label: "Finland", value: "finland" },
          { label: "Iceland", value: "iceland" },
          { label: "Ireland", value: "ireland" },
        ]}
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
