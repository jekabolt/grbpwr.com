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
      <div className="space-y-2">
        <CheckboxField
          name="subscribe"
          label="i read privacy policy information and i accept to register to your newsletter"
        />
        <CheckboxField
          name="termsOfService"
          label="by proceeding with purchase you are agreeing to accept terms and conditions and privacy information notice"
        />
      </div>
    </FieldsGroupContainer>
  );
}
