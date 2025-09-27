import { useTranslations } from "next-intl";

import { Text } from "@/components/ui/text";

export function EmptyCatalog() {
  const t = useTranslations("catalog");
  return (
    <div className="absolute inset-0 flex h-screen w-full items-center justify-center">
      <Text>{t("empty")}</Text>
    </div>
  );
}
