"use client";

import type { CSSProperties } from "react";
import { USER_TIER } from "@/constants";
import { useLocale, useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";

import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { createMarkdownComponents } from "@/app/[locale]/(content)/_components/markdown-components";
import { useMarkdownContent } from "@/app/[locale]/(content)/_components/use-markdown-content";

import { tierPrivilegesMarkdownCandidates } from "../utils/tier-privileges-content";

export function PrivateCommunity() {
  const locale = useLocale();
  const t = useTranslations("account");
  const { account } = useAccountOnboardingStore((s) => s);

  const userTier = account?.accountTier ? USER_TIER[account.accountTier] : "";
  const isHacker = account?.accountTier === "ACCOUNT_TIER_ENUM_HACKER";
  const tierText = isHacker ? "hacker" : userTier;

  const mdPaths = tierPrivilegesMarkdownCandidates(
    account?.accountTier,
    locale,
  );
  const { content, loading } = useMarkdownContent(mdPaths);

  const markdownComponents = createMarkdownComponents(undefined, {
    paragraphTone: "tier-privileges",
  });
  const proseStyle = {
    "--tw-prose-bullets": "hsl(var(--textColor))",
    "--tw-prose-counters": "hsl(var(--textColor))",
    "--tw-prose-headings": "hsl(var(--textColor))",
    "--tw-prose-body": "hsl(var(--textColor))",
  } as CSSProperties;

  return (
    <div className="flex flex-col gap-14">
      <Text variant="uppercase" className="hidden lg:block">
        {t("private community")}
      </Text>
      <div>
        <div className="flex items-center justify-between border-b border-textInactiveColor pb-6">
          <Text variant="uppercase" className="w-full">
            {t("your access")}
          </Text>
          <div className="inline-flex items-center whitespace-nowrap leading-none lg:w-full">
            <Text
              variant="uppercase"
              component="span"
              className="text-highlightColor"
            >
              grbpwr
            </Text>
            {tierText && (
              <Text
                component="span"
                className={cn("inline-block pl-[0.5px] text-highlightColor", {
                  "tracking-[0.02em]": tierText.includes("+"),
                  uppercase: isHacker,
                })}
              >
                {tierText}
              </Text>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 border-b border-textInactiveColor py-6 lg:flex-row lg:gap-0">
          <Text variant="uppercase" className="w-full">
            {t("privileges")}
          </Text>
          {mdPaths.length > 0 && !loading && content && (
            <Text
              component="div"
              className={cn(
                "prose w-full max-w-none leading-none lg:max-h-[300px] lg:overflow-y-auto",
                "[&>div:nth-child(even)]:!mb-6 [&>div:nth-child(odd)]:!mb-1.5",
                "[&>div:nth-child(even):last-child]:!mb-0",
              )}
              style={proseStyle}
            >
              <ReactMarkdown components={markdownComponents}>
                {content}
              </ReactMarkdown>
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}
