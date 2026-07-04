"use client";

import type { common_HeroNewsletterWithTranslations } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
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

  const t =
    newsletter.translations?.find((x) => x.languageId === languageId) ||
    newsletter.translations?.[0];
  const hasMedia = Boolean(
    newsletter.media?.landscape?.media || newsletter.media?.portrait?.media,
  );

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 p-6">
      {hasMedia && <HeroMedia media={newsletter.media} priority={priority} />}
      {(t?.headline || t?.body) && (
        // Direct child of the section (sibling to the media) so
        // mix-blend-exclusion blends against the media/page behind it and
        // inverts — the same structure as hero-drop. Nesting it inside another
        // positioned (z-index) wrapper isolates the blend and it stops working,
        // leaving the copy white-on-white.
        <div className="relative z-20 flex max-w-xl flex-col items-center gap-2 text-center text-bgColor mix-blend-exclusion">
          {t?.headline && (
            <Text component="h2" variant="uppercase">
              {t.headline}
            </Text>
          )}
          {t?.body && <Text>{t.body}</Text>}
        </div>
      )}
      <div className="relative z-20 w-full max-w-xl border border-textInactiveColor bg-bgColor p-6 text-textColor">
        <NewslatterForm />
      </div>
    </section>
  );
}
