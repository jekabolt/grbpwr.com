"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-dvh bg-bgColor">
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-2.5 text-center">
        <Text variant="uppercase" component="h1">
          {t("title")}
        </Text>
        <Text className="max-w-xs lg:max-w-72">{t("text")}</Text>
        <div className="flex gap-3">
          <Button type="button" variant="main" size="lg" onClick={reset}>
            {t("retry")}
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/">{t("main")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
