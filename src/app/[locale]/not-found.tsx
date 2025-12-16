import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import "../globals.css";

import { useTranslations } from "next-intl";

import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";

export const dynamic = "force-static";

export const metadata = generateCommonMetadata({
  title: "page not found".toUpperCase(),
  description: "page not found",
});

export default function NotFoundPage() {
  const t = useTranslations("not-found");
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
