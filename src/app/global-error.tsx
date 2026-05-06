"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FeatureMono } from "@/fonts";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import deMessages from "../../messages/de.json";
import enMessages from "../../messages/en.json";
import frMessages from "../../messages/fr.json";
import itMessages from "../../messages/it.json";
import jaMessages from "../../messages/ja.json";
import koMessages from "../../messages/ko.json";
import zhMessages from "../../messages/zh.json";
import "./globals.css";

import { resolveLocale } from "@/lib/utils";

const messagesByLocale = {
  en: enMessages.error,
  de: deMessages.error,
  fr: frMessages.error,
  it: itMessages.error,
  ja: jaMessages.error,
  ko: koMessages.error,
  zh: zhMessages.error,
};

type ErrorLocale = keyof typeof messagesByLocale;

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function getBrowserLocale(): ErrorLocale {
  if (typeof window === "undefined") return "en";

  const pathLocale = resolveLocale(window.location.pathname.split("/")[1]);
  if (pathLocale in messagesByLocale) return pathLocale as ErrorLocale;

  const cookieLocale = document.cookie
    .split("; ")
    .find((item) => item.startsWith("NEXT_LOCALE="))
    ?.split("=")[1];

  return resolveLocale(cookieLocale) as ErrorLocale;
}

export default function GlobalError({ error, reset }: Props) {
  const [locale, setLocale] = useState<ErrorLocale>("en");
  const t = messagesByLocale[locale];

  useEffect(() => {
    console.error(error);
    setLocale(getBrowserLocale());
  }, [error]);

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
        <div className="relative min-h-dvh bg-bgColor">
          <div className="flex h-screen flex-col items-center justify-center gap-6 px-2.5 text-center">
            <Text variant="uppercase" component="h1">
              {t.title}
            </Text>
            <Text className="max-w-xs lg:max-w-72">{t.text}</Text>
            <div className="flex gap-3">
              <Button type="button" variant="main" size="lg" onClick={reset}>
                {t.retry}
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/">{t.main}</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
