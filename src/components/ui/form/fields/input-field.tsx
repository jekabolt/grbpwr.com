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
  const { control, trigger, setValue } = useFormContext();
  const t = useTranslations("errors");

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    trigger(name);
    props.onBlur?.(event);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!keyboardRestriction || e.ctrlKey || e.metaKey) return;

    const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter"];
    if (allowedKeys.includes(e.key) || e.key.startsWith("Arrow")) return;

    if (!keyboardRestriction.test(e.key)) e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (keyboardRestriction) {
      value = value.replace(
        new RegExp(`[^${keyboardRestriction.source}]`, "g"),
        "",
      );
      value = value.replace(/[ .'-]{2,}/g, (match) => match[0]);
    }
    setValue(name, value);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel
              className={cn(
                "flex",
                srLabel ? "sr-only" : "",
                disabled ? "text-textInactiveColor" : "",
              )}
            >
              <Text>{label}</Text>
              {optional && (
                <Text className="text-textInactiveColor"> (optional)</Text>
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
              onChange={keyboardRestriction ? handleChange : field.onChange}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage translateError={t} fieldName={name} />
        </FormItem>
      )}
    />
  );
}
