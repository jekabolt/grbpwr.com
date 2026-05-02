import { Fragment } from "react";
import { EMAIL_PREFERENCES } from "@/constants";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import type { AccountEmailPreference } from "../utils/schema";

export function NewArrivals({
  value,
  onChange,
  pending,
  className,
}: {
  value: AccountEmailPreference;
  onChange: (next: AccountEmailPreference) => void;
  pending?: boolean;
  className?: string;
}) {
  const t = useTranslations("account");
  const items = Object.entries(EMAIL_PREFERENCES).map(([label, value]) => ({
    label,
    value,
  }));

  return (
    <div className={cn("flex flex-wrap items-center uppercase", className)}>
      {items.map((i, id) => {
        const selected = value === i.value;
        return (
          <Fragment key={i.value}>
            {id > 0 && (
              <Text className="mx-5 select-none text-textInactiveColor lg:mx-2">
                /
              </Text>
            )}
            <Button
              type="button"
              disabled={pending}
              variant={selected ? "underline" : "default"}
              onClick={() => onChange(i.value)}
              className={cn(
                "uppercase text-textInactiveColor hover:text-textColor",
                {
                  "text-textColor": selected,
                },
              )}
            >
              {t(i.label)}
            </Button>
          </Fragment>
        );
      })}
    </div>
  );
}
