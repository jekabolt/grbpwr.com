import type { AccountTierEnum } from "@/api/proto-http/frontend";
import { USER_TIER_CONTENT_SLUG } from "@/constants";

/** Key of the tier privileges markdown in the shop profile `legal` map ("tier-{slug}"). */
export function tierPrivilegesMarkdownKey(
  tier: AccountTierEnum | undefined,
): string | undefined {
  if (!tier) return undefined;
  const slug = USER_TIER_CONTENT_SLUG[tier];
  return slug ? `tier-${slug}` : undefined;
}
