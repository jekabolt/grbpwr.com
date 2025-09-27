import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "..";
import Input from "../../input";
import Select from "../../select";

type Props = {
  name: string;
  label: string;
  items: {
    label: string;
    value: string;
    phoneCode?: string;
  }[];
  [k: string]: any;
};

export function PhoneField({ name, label, items, ...props }: Props) {
  const { control, trigger } = useFormContext();
  const t = useTranslations("errors");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

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

  function splitValue(value: string) {
    if (!value) return { code: "", number: "" };

    if (items.length === 0) {
      return { code: "", number: value };
    }

    const foundByPhoneCode = items.find(
      (item) => item.phoneCode && value.startsWith(item.phoneCode),
    );

    if (foundByPhoneCode) {
      return {
        code: foundByPhoneCode.value,
        number: value.slice(foundByPhoneCode.phoneCode!.length),
      };
    }

    return { code: "", number: value };
  }

  function onBlur() {
    trigger(name);
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { code, number } = splitValue(field.value || "");

        const handleCodeChange = (newCode: string) => {
          const selectedItem = items.find((item) => item.value === newCode);
          const phoneCode = selectedItem?.phoneCode || newCode;
          field.onChange(phoneCode + number);
        };

        const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const digitsOnly = e.target.value.replace(/\D/g, "");
          const selectedItem = items.find((item) => item.value === code);
          const phoneCode = selectedItem?.phoneCode || code;
          field.onChange(phoneCode + digitsOnly);
        };

        const handleSelectChange = (value: string) => {
          if (!value) return "";
          const selectedItem = items.find((item) => item.value === value);
          const phoneCode = selectedItem?.phoneCode || value;
          return `+${phoneCode}`;
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="flex items-end" ref={containerRef}>
                <div className="flex items-end">
                  <Select
                    name={name + "_code"}
                    value={code}
                    onValueChange={handleCodeChange}
                    items={items}
                    disabled={props.disabled}
                    variant="secondary"
                    className="flex-row-reverse"
                    customWidth={containerWidth}
                    renderValue={handleSelectChange}
                  />
                </div>
                <Input
                  name={name + "_number"}
                  type="tel"
                  value={number}
                  onChange={handleNumberChange}
                  disabled={props.disabled}
                  variant="secondary"
                  onBlur={onBlur}
                />
              </div>
            </FormControl>
            <FormMessage translateError={t} fieldName={name} />
          </FormItem>
        );
      }}
    />
  );
}
