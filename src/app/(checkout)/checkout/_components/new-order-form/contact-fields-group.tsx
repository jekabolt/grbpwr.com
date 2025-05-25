import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import InputField from "@/components/ui/form/fields/input-field";

import FieldsGroupContainer from "./fields-group-container";

export default function ContactFieldsGroup({
  loading,
  isOpen,
  onToggle,
}: {
  loading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <FieldsGroupContainer
      stage="1/3"
      title="contact"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <InputField
        loading={loading}
        variant="secondary"
        name="email"
        label="email address:"
        type="email"
      />
      <div className="space-y-4">
        <CheckboxField
          name="subscribe"
          label="I ACCEPT TO REGISTER TO NEWSLETTER"
        />
        <CheckboxField
          name="termsOfService"
          label="*BY PROCEEDING WITH PURCHASE YOU IM AGREEING TO ACCEPT TERMS AND CONDITIONS AND PRIVACY INFORMATION NOTICE"
        />
      </div>
    </FieldsGroupContainer>
  );
}
