import { useFormContext } from "react-hook-form";

import Input, { InputProps } from "@/components/ui/input";

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
};

export default function InputField({
  loading,
  name,
  label,
  description,
  type = "text",
  srLabel,
  keyboardRestriction,
  ...props
}: Props) {
  const { control, trigger, setValue } = useFormContext();

  function onBlur() {
    trigger(name);
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
            <FormLabel className={srLabel ? "sr-only" : ""}>{label}</FormLabel>
          )}
          <FormControl>
            <Input
              type={type}
              disabled={loading}
              {...field}
              value={field.value || ""}
              {...props}
              onBlur={onBlur}
              onKeyDown={handleKeyDown}
              onChange={keyboardRestriction ? handleChange : field.onChange}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
