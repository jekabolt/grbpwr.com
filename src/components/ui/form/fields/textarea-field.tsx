import { useFormContext } from "react-hook-form";

import Textarea, { TextareaProps } from "@/components/ui/textarea";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "..";

type Props = TextareaProps & {
  description?: string;
  loading?: boolean;
  label?: string;
  srLabel?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
};

export default function TextareaField({
  loading,
  name,
  label,
  description,
  srLabel,
  maxLength,
  showCharCount = false,
  ...props
}: Props) {
  const { control, trigger, watch } = useFormContext();
  const value = watch(name) || "";

  function onBlur() {
    trigger(name);
  }

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
            <div className="relative border border-textColor">
              <Textarea
                disabled={loading}
                {...field}
                value={field.value || ""}
                maxLength={maxLength}
                {...props}
                onBlur={onBlur}
                onChange={field.onChange}
              />
              {showCharCount && (
                <div className="absolute bottom-2 right-2 text-xs text-textColor">
                  {value.length}
                  {maxLength && `/${maxLength}`}
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
