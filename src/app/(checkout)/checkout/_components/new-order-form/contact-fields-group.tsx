import Link from "next/link";
import { useFormContext } from "react-hook-form";

import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import InputField from "@/components/ui/form/fields/input-field";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "./fields-group-container";

export default function ContactFieldsGroup({
  loading,
  isOpen,
  onToggle,
  disabled = false,
}: {
  loading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const { watch } = useFormContext();
  const email = watch("email");

  return (
    <FieldsGroupContainer
      stage="1/3"
      title="contact"
      isOpen={isOpen}
      onToggle={onToggle}
      disabled={disabled}
      summary={email && <Text>{email}</Text>}
    >
      <InputField
        loading={loading}
        variant="secondary"
        name="email"
        label="email address:"
        type="email"
        disabled={disabled}
      />
      <div className="space-y-4">
        <CheckboxField
          name="subscribe"
          label="I ACCEPT TO REGISTER TO NEWSLETTER"
          disabled={disabled}
        />
        <CheckboxField
          name="termsOfService"
          label={
            <>
              *BY PROCEEDING WITH PURCHASE YOU AGREEING TO ACCEPT{" "}
              <Link
                href="/terms-and-conditions"
                className="underline hover:no-underline"
              >
                TERMS AND CONDITIONS
              </Link>{" "}
              AND{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:no-underline"
              >
                PRIVACY INFORMATION NOTICE
              </Link>
            </>
          }
          disabled={disabled}
        />
      </div>
    </FieldsGroupContainer>
  );
}
