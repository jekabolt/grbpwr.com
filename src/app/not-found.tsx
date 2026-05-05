import Link from "next/link";
import { cookies } from "next/headers";

import { NotFoundTracker } from "@/app/[locale]/_components/not-found-tracker";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FeatureMono } from "@/fonts";
import { routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

import "./globals.css";

function resolveLocale(tag: string | undefined) {
  if (tag && (routing.locales as readonly string[]).includes(tag)) {
    return tag;
  }
  return routing.defaultLocale;
}

export default async function GlobalNotFound() {
  const store = await cookies();
  const locale = resolveLocale(store.get("NEXT_LOCALE")?.value);

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "not-found" });

  return (
    <html lang={locale}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html{background-color:#fff}body{background-color:#fff;touch-action:manipulation}",
          }}
        />
      </head>
      <body className={FeatureMono.className}>
        <NotFoundTracker />
        <div className="bg-bgColor relative min-h-dvh">
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
