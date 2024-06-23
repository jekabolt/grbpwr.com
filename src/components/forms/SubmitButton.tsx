"use client";

// @ts-ignore
import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";

type Props = {
  text: string;
  disabled?: boolean;
};

export function SubmitButton({ text, disabled }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      style={ButtonStyle.simpleButton}
      type="submit"
      disabled={disabled || pending}
    >
      {text}
    </Button>
  );
}
