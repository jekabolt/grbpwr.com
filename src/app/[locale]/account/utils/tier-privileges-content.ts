import type { AccountTierEnum } from "@/api/proto-http/frontend";
import { USER_TIER_CONTENT_SLUG } from "@/constants";

/** Fetch paths for `public/content/tier/{slug}/{locale}.md` (locale fallback to `en`). */
export function tierPrivilegesMarkdownCandidates(
  tier: AccountTierEnum | undefined,
  locale: string,
): string[] {
  if (!tier) return [];
  const slug = USER_TIER_CONTENT_SLUG[tier];
  if (!slug) return [];
  const base = `/content/tier/${slug}`;
  return [`${base}/${locale}.md`, `${base}/en.md`];
}
