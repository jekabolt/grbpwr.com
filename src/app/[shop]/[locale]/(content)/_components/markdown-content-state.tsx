"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface Props {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: React.ReactNode;
}

/**
 * Shared loading/error/retry wrapper for markdown-backed content surfaces
 * (FAQ, legal notices). Renders a flat hairline skeleton while loading and a
 * localized, retryable message on error. A legitimately empty 200 response
 * (error === null) renders children.
 */
export function MarkdownContentState({
  loading,
  error,
  onRetry,
  children,
}: Props) {
  const t = useTranslations("content");
  const tError = useTranslations("error");

  if (loading) {
    return (
      <div className="w-full" aria-busy="true">
        <div className="h-16 border-b border-textColor" />
        <div className="h-16 border-b border-textColor" />
        <div className="h-16 border-b border-transparent" />
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="flex w-full flex-col items-start gap-y-4">
        <Text variant="uppercase">{t("content_load_error")}</Text>
        <Button
          variant="simpleReverseWithBorder"
          className="px-4 py-2.5 uppercase"
          onClick={onRetry}
        >
          {tError("retry")}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
