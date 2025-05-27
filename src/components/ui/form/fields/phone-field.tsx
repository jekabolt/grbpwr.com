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
  }[];
  [k: string]: any;
};

export function PhoneField({ name, label, items, ...props }: Props) {
  const { control, trigger } = useFormContext();

  function splitValue(value: string) {
    if (!value) return { code: "", number: "" };

    if (items.length === 0) {
      return { code: "", number: value };
    }

    const found = items.find((item) => value.startsWith(item.value));
    if (found) {
      return {
        code: found.value,
        number: value.slice(found.value.length),
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
          field.onChange(newCode + number);
        };

        const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const digitsOnly = e.target.value.replace(/\D/g, "");
          field.onChange(code + digitsOnly);
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Select
                  name={name + "_code"}
                  value={code}
                  onValueChange={handleCodeChange}
                  items={items}
                  disabled={props.disabled}
                  variant="secondary"
                  className="w-20"
                  renderValue={(selectedValue) =>
                    selectedValue ? `+${selectedValue}` : ""
                  }
                />
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
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
