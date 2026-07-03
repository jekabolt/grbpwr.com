"use client";

import type { common_HeroNewsletterWithTranslations } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { HeroMedia } from "./hero-media";
import NewslatterForm from "./newsletter-form";

// NEWSLETTER hero: a full-viewport email capture over an optional media
// background. Hero copy (headline/subhead) comes from the block translation; the
// capture reuses the shared <NewslatterForm> — same zod validation, analytics,
// SubscribeNewsletter delivery and success toast as the footer — sitting on a
// solid hairline panel so it stays legible over any background.
export function HeroNewsletter({
  newsletter,
  priority = false,
}: {
  newsletter?: common_HeroNewsletterWithTranslations;
  priority?: boolean;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  if (!newsletter) return null;

  const t = newsletter.translations?.find((x) => x.languageId === languageId);
  const hasMedia = Boolean(
    newsletter.media?.landscape?.media || newsletter.media?.portrait?.media,
  );

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center">
      {hasMedia && <HeroMedia media={newsletter.media} priority={priority} />}
      <div className="relative z-20 flex w-full max-w-xl flex-col items-center gap-8 p-6">
        {t?.headline && (
          <Text
            component="h2"
            variant="uppercase"
            className={cn(
              "text-center",
              hasMedia ? "text-bgColor" : "text-textColor",
            )}
          >
            {t.headline}
          </Text>
        )}
        <div className="w-full border border-textColor bg-bgColor p-6 text-textColor">
          <NewslatterForm />
        </div>
      </div>
    </section>
  );
}
