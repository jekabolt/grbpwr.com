import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { resolvePhoneCodeItemForNumber } from "@/lib/phone/phone-validation";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "..";
import Input from "../../input";
import Select from "../../select";

export type PhoneFieldProps = {
  name: string;
  label: string;
  items: {
    label: string;
    value: string;
    phoneCode?: string;
  }[];
  selectedCountry?: string;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  variant?: string;
  optional?: boolean;
  displayTrigger?: boolean;
};

export function PhoneField({
  name,
  label,
  items,
  selectedCountry,
  optional,
  displayTrigger = true,
  ...props
}: PhoneFieldProps) {
  const { control, trigger, setValue, getValues, formState } = useFormContext();
  const tErrors = useTranslations("errors");
  const tCheckout = useTranslations("checkout");
  const containerRef = useRef<HTMLDivElement>(null);
  const initialDialSeedDoneRef = useRef(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [showPhoneError, setShowPhoneError] = useState(false);
  const submitAttempted =
    formState.isSubmitted || (formState.submitCount ?? 0) > 0;

  const defaultItem = useMemo(() => {
    if (items.length === 0) return undefined;
    if (selectedCountry) {
      const needle = `${selectedCountry.toLowerCase()}-`;
      const match = items.find((item) => item.value.startsWith(needle));
      if (match) return match;
    }
    return items[0];
  }, [items, selectedCountry]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        setContainerWidth(width);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const normalize = (raw: string) => {
    const trimmed = raw.trimStart();
    const hasPlus = trimmed.startsWith("+");
    const digits = raw.replace(/\D/g, "");
    return `${hasPlus ? "+" : ""}${digits}`;
  };

  const writeValue = (next: string) => {
    setValue(name, next, {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    if (initialDialSeedDoneRef.current) return;

    const current = String(getValues(name) ?? "");
    if (current) {
      initialDialSeedDoneRef.current = true;
      return;
    }

    if (!defaultItem?.phoneCode) return;

    initialDialSeedDoneRef.current = true;
    setValue(name, `+${defaultItem.phoneCode}`, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [defaultItem?.phoneCode, getValues, name, setValue]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const phoneValue = String(field.value ?? "");
        const phoneDigits = phoneValue.replace(/\D/g, "");
        const trimmedStart = phoneValue.trimStart();
        const inputDisplayValue =
          phoneDigits.length > 0
            ? `+${phoneDigits}`
            : trimmedStart.startsWith("+")
              ? "+"
              : "";
        const normalized = normalize(phoneValue);
        const prefixItem = resolvePhoneCodeItemForNumber(normalized, items);
        const activeItem = prefixItem ?? defaultItem;
        const activeCodeValue = activeItem?.value ?? "";

        const handleCodeChange = (newCode: string) => {
          const selectedItem = items.find((item) => item.value === newCode);
          const newPhoneCode = selectedItem?.phoneCode ?? "";
          if (!newPhoneCode) return;

          const digits = normalized.replace(/\D/g, "");
          const oldPhoneCode = activeItem?.phoneCode ?? "";
          const rest =
            oldPhoneCode && digits.startsWith(oldPhoneCode)
              ? digits.slice(oldPhoneCode.length)
              : digits;

          const restWithoutDup = rest.startsWith(newPhoneCode)
            ? rest.slice(newPhoneCode.length)
            : rest;

          writeValue(`+${newPhoneCode}${restWithoutDup}`);
        };

        const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const next = normalize(e.target.value);
          const dialCode = activeItem?.phoneCode ?? "";
          const digits = next.replace(/\D/g, "");

          if (!dialCode) {
            writeValue(digits ? `+${digits}` : next === "+" ? "+" : "");
            return;
          }

          if (!digits) {
            writeValue(next === "+" ? "+" : "");
            return;
          }

          const doubled = `${dialCode}${dialCode}`;
          const collapsedDigits = digits.startsWith(doubled)
            ? dialCode + digits.slice(doubled.length)
            : digits;

          writeValue(`+${collapsedDigits}`);
        };

        const renderEmpty = () => "";

        return (
          <FormItem>
            <FormLabel
              className={cn("inline-flex items-center", {
                "text-textInactiveColor": props.disabled,
              })}
            >
              <Text component="span">{label}</Text>
              {optional && (
                <Text
                  component="span"
                  className="ml-1 whitespace-nowrap text-textInactiveColor"
                >
                  ({tCheckout("optional")})
                </Text>
              )}
            </FormLabel>
            <FormControl>
              <div className="flex items-end" ref={containerRef}>
                <div className="flex items-end">
                  <Select
                    name={name + "_code"}
                    value={activeCodeValue}
                    onValueChange={handleCodeChange}
                    items={items}
                    disabled={props.disabled}
                    className="flex-row-reverse text-textBaseSize"
                    customWidth={containerWidth}
                    renderValue={renderEmpty}
                    readOnly={props.readOnly}
                    displayTrigger={displayTrigger && !props.disabled}
                  />
                </div>
                <Input
                  name={name}
                  type="tel"
                  value={inputDisplayValue}
                  onChange={handlePhoneChange}
                  disabled={props.disabled}
                  readOnly={props.readOnly}
                  variant="secondary"
                  onFocus={() => setShowPhoneError(false)}
                  onBlur={() => {
                    field.onBlur();
                    setShowPhoneError(true);
                    void trigger(name);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage
              translateError={tErrors}
              fieldName={name}
              gate={showPhoneError || submitAttempted}
            />
          </FormItem>
        );
      }}
    />
  );
}
