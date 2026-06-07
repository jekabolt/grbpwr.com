import { cookies } from "next/headers";
import Link from "next/link";
import { FeatureMono } from "@/fonts";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { NotFoundTracker } from "@/app/[locale]/_components/not-found-tracker";

import "./globals.css";

import { resolveLocale } from "@/lib/utils";

export default async function GlobalNotFound() {
  const store = await cookies();
  const locale = resolveLocale(store.get("NEXT_LOCALE")?.value);

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "not-found" });

  return (
    <html lang={locale}>
      <head>
        <title>{`404 — ${t("title")} · grbpwr.com`}</title>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html{background-color:#fff}body{background-color:#fff;touch-action:manipulation}",
          }}
        />
      </head>
      <body className={FeatureMono.className}>
        <NotFoundTracker />
        <div className="relative min-h-dvh bg-bgColor">
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
        </div>
      </body>
    </html>
  );
}
