"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "./button";

interface Props {
  suggestCountry?: string;
  suggestLocale?: string;
  suggestPath?: string;
  currentCountry?: string;
  currentLocale?: string;
}

export function GeoSuggestBanner({
  suggestCountry,
  suggestLocale,
  suggestPath,
  currentCountry,
  currentLocale,
}: Props) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const targetHref = useMemo(() => {
    if (!suggestCountry || !suggestLocale) return null;
    const rest = suggestPath || "";
    return `/${suggestCountry}/${suggestLocale}${rest}`;
  }, [suggestCountry, suggestLocale, suggestPath]);

  useEffect(() => {
    if (!suggestCountry || !suggestLocale) return;
    const alreadyOnSuggested = pathname?.startsWith(
      `/${suggestCountry}/${suggestLocale}`,
    );
    setVisible(!alreadyOnSuggested);
  }, [pathname, suggestCountry, suggestLocale]);

  const clearSuggestion = useCallback(async () => {
    try {
      await fetch("/api/geo-suggest/dismiss", { method: "POST" });
    } catch {}
  }, []);

  const onDismiss = useCallback(async () => {
    setVisible(false);
    await clearSuggestion();
  }, [clearSuggestion]);

  const onAccept = useCallback(async () => {
    if (!targetHref) return;
    await clearSuggestion();
    router.push(targetHref);
  }, [targetHref, clearSuggestion, router]);

  if (!visible || !targetHref) return null;

  return (
    <div
      className={cn(
        "blackTheme fixed inset-x-2 top-2 z-40 flex items-center justify-between gap-3 bg-bgColor p-2.5 text-textColor lg:bottom-2 lg:left-auto lg:top-auto lg:w-[520px]",
      )}
      role="region"
      aria-label="Geo suggestion"
    >
      <div className="text-sm">
        We detected your region. Switch to {suggestCountry?.toUpperCase()} /{" "}
        {suggestLocale?.toUpperCase()}?
      </div>
      <div className="flex items-center gap-2">
        <Button variant="simpleReverse" size="sm" onClick={onDismiss}>
          Stay {currentCountry?.toUpperCase()} / {currentLocale?.toUpperCase()}
        </Button>
        <Button variant="secondary" size="sm" onClick={onAccept}>
          Switch
        </Button>
      </div>
    </div>
  );
}
