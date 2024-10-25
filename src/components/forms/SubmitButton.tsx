"use client";

// @ts-ignore
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type Props = {
  text: string;
  disabled?: boolean;
};

export function SubmitButton({ text, disabled = false }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      loading={pending}
      variant="main"
      size="lg"
    >
      {text}
    </Button>
  );
}
