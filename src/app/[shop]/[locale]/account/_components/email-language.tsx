import { Fragment } from "react";
import { EMAIL_LANGUAGE_VALUES, LOCALE_DISPLAY_NAMES } from "@/constants";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import type { EmailLanguageValue } from "../utils/schema";

export function EmailLanguage({
  value,
  onChange,
  pending,
  className,
}: {
  value: EmailLanguageValue;
  onChange: (next: EmailLanguageValue) => void;
  pending?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center uppercase", className)}>
      {EMAIL_LANGUAGE_VALUES.map((locale, id) => {
        const selected = value === locale;
        return (
          <Fragment key={locale}>
            {id > 0 && (
              <Text className="mx-5 select-none text-textInactiveColor lg:mx-2">
                /
              </Text>
            )}
            <Button
              type="button"
              disabled={pending}
              variant={selected ? "underline" : "default"}
              onClick={() => onChange(locale)}
              className={cn("uppercase", {
                "text-textColor": selected,
              })}
            >
              {LOCALE_DISPLAY_NAMES[locale]}
            </Button>
          </Fragment>
        );
      })}
    </div>
  );
}
