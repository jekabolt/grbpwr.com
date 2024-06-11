"use client";

// @ts-ignore
import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";
import { LinkStyle } from "@/components/ui/Button/styles";

type Props = {
  text: string;
};

export function SubmitButton({ text }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button style={LinkStyle.simpleButton} type="submit" disabled={pending}>
      {text}
    </Button>
  );
}
