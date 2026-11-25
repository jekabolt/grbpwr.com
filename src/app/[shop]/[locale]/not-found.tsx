import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import "../../globals.css";

import { useTranslations } from "next-intl";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { getShopMeta } from "@/lib/shop/server";
import FlexibleLayout from "@/components/flexible-layout";

import { NotFoundTracker } from "./_components/not-found-tracker";

// ISR per shop: the `[shop]` segment (request host, set by the middleware)
// keys the cache, so one shop's page is never served on another host.
export const dynamic = "force-static";

export async function generateMetadata() {
  const brand = await getShopMeta();
  return generateCommonMetadata({
    brand,
    title: "page not found".toUpperCase(),
    description: "page not found",
  });
}

export default function NotFoundPage() {
  const t = useTranslations("not-found");
  return (
    <FlexibleLayout headerType="catalog">
      <NotFoundTracker />
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <Text variant="uppercase" component="h1">
          {t("title")}
        </Text>
        <Text className="max-w-xs px-2.5 text-center lg:max-w-72 lg:px-0">
          {t("text")}
        </Text>
        <Button asChild variant="main" size="lg" className="uppercase">
          <Link href="/">{t("main")}</Link>
        </Button>
      </div>
    </FlexibleLayout>
  );
}
