import { getTranslations } from "next-intl/server";

import { Text } from "@/components/ui/text";

// Shown on every page of a shop that is switched off (owner or operator).
export async function ShopClosed({ name }: { name?: string }) {
  const t = await getTranslations("shop");
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bgColor px-2.5">
      {name ? (
        <Text variant="uppercase" component="h1">
          {name}
        </Text>
      ) : null}
      <Text variant="uppercase">{t("closed")}</Text>
    </div>
  );
}
