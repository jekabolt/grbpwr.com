import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import Input, { InputProps } from "./input";
import { Text } from "./text";

type Props = InputProps & {
  value: string;
  noFound?: boolean;
  handleSearch: (e: string) => void;
};

export function Searchbar({ value, noFound, handleSearch, ...props }: Props) {
  const t = useTranslations("countries-popup");
  return (
    <div>
      <div className="flex h-9 cursor-pointer items-center gap-2 border border-textInactiveColor px-4 py-2.5 hover:border-textColor">
        <div className="flex-1">
          <Input
            value={value}
            className="cursor-pointer border-none uppercase"
            autoComplete="off"
            autoCorrect="off"
            {...props}
            spellCheck={false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
          />
        </div>
        <Button
          className={`transform transition-all duration-200 ease-out ${
            value
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }`}
          onClick={() => handleSearch("")}
        >
          x
        </Button>
      </div>

      <Text
        className={cn(
          "transform border border-textInactiveColor px-4 py-1 opacity-0 transition-all duration-200 ease-in-out",
          {
            "opacity-100": value && noFound,
          },
        )}
      >
        {t("not-found")}
      </Text>
    </div>
  );
}
