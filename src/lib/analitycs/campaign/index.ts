const CAMPAIGN_STORAGE_KEY = "analytics_first_user_campaign";

export interface CampaignParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
}

function getUrlParams(): URLSearchParams | null {
  if (typeof window === "undefined") return null;
  try {
    return new URLSearchParams(window.location.search);
  } catch {
    return null;
  }
}

function getCampaignFromUrl(): CampaignParams | null {
  const params = getUrlParams();
  if (!params) return null;

  const utm_source = params.get("utm_source") ?? undefined;
  const utm_medium = params.get("utm_medium") ?? undefined;
  const utm_campaign = params.get("utm_campaign") ?? undefined;
  const utm_content = params.get("utm_content") ?? undefined;
  const utm_term = params.get("utm_term") ?? undefined;
  const gclid = params.get("gclid") ?? undefined;
  const fbclid = params.get("fbclid") ?? undefined;

  const hasAny =
    utm_source ||
    utm_medium ||
    utm_campaign ||
    utm_content ||
    utm_term ||
    gclid ||
    fbclid;

  if (!hasAny) return null;

  return {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    gclid,
    fbclid,
  };
}

/**
 * Capture campaign params from URL on load and persist to sessionStorage.
 * First-touch: only stores if nothing stored yet this session.
 */
export function captureCampaignOnLoad(): void {
  try {
    if (typeof window === "undefined") return;
    const existing = sessionStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (existing) return;

    const campaign = getCampaignFromUrl();
    if (campaign) {
      sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaign));
    }
  } catch {
    // ignore
  }
}

/**
 * Returns stored first-touch campaign params or current URL params.
 */
export function getStoredCampaignParams(): CampaignParams | null {
  try {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CampaignParams;
    }
    return getCampaignFromUrl();
  } catch {
    return null;
  }
}
