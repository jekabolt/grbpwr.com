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
        placeholder="james.bond@example.com"
      />
      <InputField
        loading={loading}
        variant="secondary"
        type="number"
        name="phone"
        label="phone number:"
        placeholder="James Bond"
      />
      <div className="space-y-2">
        <CheckboxField
          name="subscribe"
          label="email me with news and offers to our newsletter"
        />
        <CheckboxField
          name="termsOfService"
          label="i accept the privacy policy and terms & conditions"
        />
      </div>
    </FieldsGroupContainer>
  );
}
