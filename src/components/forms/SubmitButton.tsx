"use client";

// @ts-ignore
import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";

type Props = {
  text: string;
};

export function SubmitButton({ text }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button style={ButtonStyle.simpleButton} type="submit" disabled={pending}>
      {text}
    </Button>
  );
}
