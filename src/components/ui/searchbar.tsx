import { useTranslations } from "next-intl";

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
            aria-label={t("search location")}
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
          aria-label={t("clear search")}
          aria-hidden={!value}
          tabIndex={value ? 0 : -1}
          className={`transform transition-[transform,opacity] duration-200 ease-out ${
            value
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }`}
          onClick={() => handleSearch("")}
        >
          x
        </Button>
      </div>

      <div role="status" aria-live="polite">
        {value && noFound && (
          <Text className="border border-textInactiveColor px-4 py-1">
            {t("not-found")}
          </Text>
        )}
      </div>
    </div>
  );
}
