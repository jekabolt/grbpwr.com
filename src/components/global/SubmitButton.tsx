"use client";

// @ts-ignore
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text: string;
  className?: string;
}

export function SubmitButton({ text, className = "" }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {text}
    </button>
  );
}
