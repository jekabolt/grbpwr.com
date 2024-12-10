import type { Control } from "react-hook-form";

import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import InputField from "@/components/ui/form/fields/input-field";

import FieldsGroupContainer from "./fields-group-container";

export default function Component({
  control,
  loading,
}: {
  control: Control<any>;
  loading: boolean;
}) {
  return (
    <FieldsGroupContainer stage="1/3" title="contact">
      <InputField
        control={control}
        loading={loading}
        name="email"
        label="email address:"
        type="email"
        placeholder="james.bond@example.com"
      />
      <InputField
        control={control}
        loading={loading}
        type="number"
        name="phone"
        label="phone number:"
        placeholder="James Bond"
      />
      <div className="space-y-2">
        <CheckboxField
          control={control}
          name="subscribe"
          label="email me with news and offers to our newsletter"
        />
        <CheckboxField
          control={control}
          name="termsOfService"
          label="i accept the privacy policy and terms & conditions"
        />
      </div>
    </FieldsGroupContainer>
  );
}
