import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import "../globals.css";

import { getTranslations } from "next-intl/server";

import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";

export const dynamic = "force-static";

export function generateMetadata() {
  return generateCommonMetadata({
    title: "page not found".toUpperCase(),
    description: "page not found",
  });
}

export default async function NotFoundPage() {
  const t = await getTranslations("not-found");
  return (
    <FlexibleLayout headerType="catalog">
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
