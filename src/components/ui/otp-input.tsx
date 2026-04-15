"use client";

import {
  useCallback,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import { cn } from "@/lib/utils";
import Input from "@/components/ui/input";

const LENGTH = 6;

export type OtpInputProps = {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  onComplete?: (code: string) => void;
};

function sanitizeDigits(raw: string) {
  return raw.replace(/\D/g, "");
}

export function OtpInput({
  value,
  disabled,
  id,
  className,
  onChange,
  onComplete,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const commit = useCallback(
    (next: string) => {
      const clipped = sanitizeDigits(next).slice(0, LENGTH);
      onChange(clipped);
      if (clipped.length === LENGTH) {
        onComplete?.(clipped);
      }
    },
    [onChange, onComplete],
  );

  const focusAt = (i: number) => {
    inputsRef.current[i]?.focus();
  };

  const handleChange = (index: number, raw: string) => {
    if (raw.length > 1) {
      commit(raw);
      focusAt(Math.min(sanitizeDigits(raw).length, LENGTH - 1));
      return;
    }
    const digit = sanitizeDigits(raw);
    const prefix = value.slice(0, index);
    const suffix = value.slice(index + 1);
    const next = (prefix + (digit.slice(-1) ?? "") + suffix).slice(0, LENGTH);
    commit(next);
    if (digit && index < LENGTH - 1) {
      focusAt(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        commit(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        commit(value.slice(0, index - 1) + value.slice(index));
        focusAt(index - 1);
      }
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      focusAt(index - 1);
      e.preventDefault();
    }
    if (e.key === "ArrowRight" && index < LENGTH - 1) {
      focusAt(index + 1);
      e.preventDefault();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    commit(text);
    const len = sanitizeDigits(text).length;
    focusAt(Math.min(Math.max(len - 1, 0), LENGTH - 1));
  };

  return (
    <div
      id={id}
      role="group"
      aria-label="One-time code"
      className={cn("flex gap-2", className)}
      onPaste={handlePaste}
    >
      {Array.from({ length: LENGTH }, (_, i) => {
        const char = value[i] ?? "";
        return (
          <Input
            key={i}
            ref={(el: HTMLInputElement | null) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            name={`otp-${i}`}
            aria-label={`Digit ${i + 1} of ${LENGTH}`}
            disabled={disabled}
            value={char}
            maxLength={1}
            className={cn(
              "box-border size-11 w-11 border border-textColor text-center tabular-nums",
              "caret-textColor focus:border-textColor",
              "disabled:border-textInactiveColor disabled:text-textInactiveColor",
            )}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(i, e.target.value)
            }
            onFocus={(e: FocusEvent<HTMLInputElement>) =>
              e.currentTarget.select()
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(i, e)
            }
          />
        );
      })}
    </div>
  );
}
