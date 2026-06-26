import { INVALID_CHARACTER_ERROR } from "@/constants";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import Input, { InputProps } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "..";

type Props = InputProps & {
  description?: string;
  loading?: boolean;
  keyboardRestriction?: RegExp;
  optional?: boolean;
};

function stripDisallowedChars(value: string, allowed: RegExp) {
  return [...value].filter((char) => allowed.test(char)).join("");
}

export default function InputField({
  loading,
  name,
  label,
  description,
  type = "text",
  srLabel,
  keyboardRestriction,
  disabled,
  optional,
  ...props
}: Props) {
  const { control, trigger, setError, clearErrors, setValue, getValues } =
    useFormContext();
  const tErrors = useTranslations("errors");
  const tCheckout = useTranslations("checkout");
  const hasInvalidCharacterError = useRef(false);

  function showInvalidCharacterError() {
    hasInvalidCharacterError.current = true;
    setError(name, {
      type: "invalidCharacter",
      message: INVALID_CHARACTER_ERROR,
    });
    setValue(name, getValues(name), { shouldTouch: true });
  }

  function clearInvalidCharacterError() {
    if (!hasInvalidCharacterError.current) return;
    hasInvalidCharacterError.current = false;
    clearErrors(name);
    void trigger(name);
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
          field.onBlur();
          void trigger(name);
          props.onBlur?.(event);
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (!keyboardRestriction || e.ctrlKey || e.metaKey) return;

          const allowedKeys = [
            "Backspace",
            "Delete",
            "Tab",
            "Escape",
            "Enter",
          ];
          if (allowedKeys.includes(e.key) || e.key.startsWith("Arrow")) return;

          if (!keyboardRestriction.test(e.key)) {
            e.preventDefault();
            showInvalidCharacterError();
            return;
          }

          clearInvalidCharacterError();
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value = e.target.value;
          if (keyboardRestriction) {
            const stripped = stripDisallowedChars(value, keyboardRestriction);
            if (stripped !== value) {
              showInvalidCharacterError();
              value = stripped;
            } else {
              clearInvalidCharacterError();
            }
            value = value.replace(/[ .'-]{2,}/g, (match) => match[0]);
          }
          field.onChange(value);
        };

        return (
          <FormItem>
            {label && (
              <FormLabel
                className={cn(
                  "inline-flex items-center",
                  srLabel ? "sr-only" : "",
                  disabled ? "text-textInactiveColor" : "",
                )}
              >
                <Text component="span">{label}</Text>
                {optional && (
                  <Text
                    component="span"
                    className="ml-1 whitespace-nowrap"
                  >
                    ({tCheckout("optional")}):
                  </Text>
                )}
              </FormLabel>
            )}
            <FormControl>
              <Input
                type={type}
                {...field}
                value={field.value || ""}
                {...props}
                disabled={disabled}
                className={props.className}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onChange={
                  keyboardRestriction ? handleChange : field.onChange
                }
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage translateError={tErrors} fieldName={name} />
          </FormItem>
        );
      }}
    />
  );
}
