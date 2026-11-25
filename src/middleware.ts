import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";

import { resolvePack, type ShopPack } from "./brands";
import { homepageMarkdown } from "./lib/agent-markdown";
import {
  clearSuggestCookies,
  getLocaleFromCountry,
  getNormalizedCountry,
  handleFromPickerAction,
  handleGeoAction,
  parseCountryLocalePath,
  parseLocaleOnlyPath,
  setMainCookies,
  setSuggestedCookies,
  supportedCountries,
} from "./lib/middleware-utils";
import { normalizeShopHost, resolveShopHost } from "./lib/shop/host";
import { fetchShopProfile, type ShopProfile } from "./lib/shop/profile";
import {
  isPackPublicFile,
  isPackRootFileName,
  isRootRouteHandler,
  isSharedPublicFile,
  mayRedirectToPrimary,
  packPublicFileAllowed,
  packRootFile,
  primaryHostRedirect,
  shopPagePath,
  staticHostRedirect,
} from "./lib/shop/routing";

const intlMiddleware = createMiddleware(routing);

// Agent-discovery Link header (RFC 8288) for the homepage: advertise the API
// catalog (RFC 9727, grbpwr pack only — other shops' API needs x-shop-host),
// the markdown alternate (see Markdown-for-Agents above) and the sitemap. Only
// resources that exist and are locale-agnostic are listed.
const HOMEPAGE_LINK_HEADER =
  '</>; rel="alternate"; type="text/markdown", </sitemap.xml>; rel="sitemap"';
const PACK_HOMEPAGE_LINK_HEADER =
  '</.well-known/api-catalog>; rel="api-catalog", ' + HOMEPAGE_LINK_HEADER;

// Primary-host lookup for the 308 below: one profile read per host and edge
// instance a minute, short timeout, fail-open (a slow backend never blocks a
// page). grbpwr's own hosts never get here (GRBPWR_STAY_HOSTS).
const PRIMARY_TTL_MS = 60_000;
const PRIMARY_TIMEOUT_MS = 1_500;
const primaryCache = new Map<
  string,
  { at: number; profile: ShopProfile | null }
>();

async function shopProfileForRedirect(
  host: string,
): Promise<ShopProfile | null> {
  const hit = primaryCache.get(host);
  if (hit && Date.now() - hit.at < PRIMARY_TTL_MS) return hit.profile;
  const result = await fetchShopProfile(host, {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
    fetchImpl: (url, init) =>
      fetch(url, { ...init, signal: AbortSignal.timeout(PRIMARY_TIMEOUT_MS) }),
  });
  const profile =
    result.status === "ok" || result.status === "closed"
      ? result.profile ?? null
      : null;
  // Errors are not cached: the next request retries.
  if (result.status !== "error") {
    if (primaryCache.size > 500) primaryCache.clear();
    primaryCache.set(host, { at: Date.now(), profile });
  }
  return profile;
}

const notFound = () => new NextResponse("Not Found", { status: 404 });

// Locale-agnostic detail routes: src/app/[locale]/p/[handle] and
// src/app/[locale]/timeline/[handle] are addressed by locale alone (no
// {country} folder in the file-system route), unlike every other page on
// the site. A rest path matching this must be served at /{locale}/{rest}
// directly and must never be bounced through a /{country}/{locale}/{rest}
// hop first — that hop is what produced the /de/en/p/... and
// /de/de/timeline/... double-prefixed 404s.
const LOCALE_ONLY_DETAIL_REST = /^\/(?:p|timeline)\/[^/]+\/?$/;

function detectCountry(req: NextRequest): string {
  return process.env.NODE_ENV === "development"
    ? "gb"
    : req.headers.get("x-vercel-ip-country") || "gb";
}

// Builds the final rewrite response for a resolved {country, locale, rest}:
// runs next-intl for translations, injects x-nextjs-country/locale plus a
// URL-derived Cookie header for RSC, and persists the main/suggest cookies.
// Shared by the /{country}/{locale}/{rest} path and the locale-only fast
// path for /p/[handle] and /timeline/[handle] below, so both entry points
// stay behaviorally identical instead of drifting apart.
function finalizeLocalizedResponse(
  req: NextRequest,
  shop: { host: string; pack: ShopPack | undefined },
  country: string,
  locale: string,
  rest: string,
  isPreview: boolean,
): NextResponse {
  const countryCookie = req.cookies.get("NEXT_COUNTRY")?.value;
  const localeCookie = req.cookies.get("NEXT_LOCALE")?.value;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${rest}` || "/";

  // suggest cookies control - only for new users (no cookies)
  const hadCountry = Boolean(countryCookie);
  const hadLocale = Boolean(localeCookie);
  let geoCountry = "";
  let geoLocale = "";
  let shouldSuggest = false;

  if (!hadCountry || !hadLocale) {
    geoCountry = getNormalizedCountry(detectCountry(req));
    geoLocale = getLocaleFromCountry(geoCountry);
    shouldSuggest = geoCountry !== country || geoLocale !== locale;
  }

  const newReq = new NextRequest(url, { headers: req.headers });
  // Still run intlMiddleware so next-intl picks up the rewritten URL for
  // translations, but discard its response — we manage cookies ourselves.
  intlMiddleware(newReq);

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-nextjs-country", country);
  reqHeaders.set("x-nextjs-locale", locale);
  // Override the request's Cookie header so RSC/server components see the
  // URL-derived values immediately, even if the browser still holds a stale
  // NEXT_LOCALE from before. Without this, getInitialTranslationState reads
  // the old cookie and initializes the store with the wrong language.
  const existingCookies = req.headers.get("cookie") ?? "";
  const cookiesWithoutLocale = existingCookies
    .split(/;\s*/)
    .filter((c) => c && !/^NEXT_(LOCALE|COUNTRY)=/.test(c))
    .join("; ");
  reqHeaders.set(
    "cookie",
    [cookiesWithoutLocale, `NEXT_COUNTRY=${country}`, `NEXT_LOCALE=${locale}`]
      .filter(Boolean)
      .join("; "),
  );
  if (shouldSuggest) {
    reqHeaders.set("x-geo-suggest-country", geoCountry);
    reqHeaders.set("x-geo-suggest-locale", geoLocale);
    reqHeaders.set("x-geo-suggest-current", country);
  }

  // `[shop]` = the request host: ISR caches every page per shop.
  const rewriteUrl = new URL(
    shopPagePath(shop.host, locale, rest) + url.search,
    req.url,
  );
  const res = NextResponse.rewrite(rewriteUrl, {
    request: { headers: reqHeaders },
  });
  // Prevent any edge/CDN caching of this rewrite — we depend on the
  // Set-Cookie below being applied on every request.
  res.headers.set("Cache-Control", "no-store");
  // Homepage only: point agents at the markdown alternate and sitemap.
  if (!rest?.trim()) {
    res.headers.append(
      "Link",
      shop.pack ? PACK_HOMEPAGE_LINK_HEADER : HOMEPAGE_LINK_HEADER,
    );
    res.headers.set("Vary", "Accept");
    // The homepage is prerendered (force-static) and personalised only via
    // the cookies set below (read client-side), so `private` is the honest
    // signal vs `no-store`: the browser may reuse it (revalidating first),
    // shared caches/proxies must not. It still isn't CDN-cached — the
    // Set-Cookie precludes that — but the header no longer misrepresents a
    // prerendered page as non-storable, which was confusing diagnostics and
    // third-party caches/proxies.
    res.headers.set("Cache-Control", "private, no-cache, must-revalidate");
  }
  // Editor preview iframe: the URL locale is authoritative and we must not
  // mutate the visitor's storefront NEXT_LOCALE/COUNTRY cookies. The rewrite
  // already carries x-nextjs-locale + a URL-derived Cookie header for the RSC
  // read, so the preview renders in the URL's language without persisting it.
  if (isPreview) return res;
  setMainCookies(res, country, locale);
  const suggestCountryCookie = req.cookies.get("NEXT_SUGGEST_COUNTRY")?.value;
  const suggestLocaleCookie = req.cookies.get("NEXT_SUGGEST_LOCALE")?.value;
  const suggestCurrentCookie = req.cookies.get(
    "NEXT_SUGGEST_CURRENT_COUNTRY",
  )?.value;

  if (shouldSuggest) {
    setSuggestedCookies(res, geoCountry, geoLocale, country);
  } else if (
    suggestCountryCookie &&
    suggestLocaleCookie &&
    suggestCurrentCookie
  ) {
    const onSuggestedNow =
      suggestCountryCookie.toLowerCase() === country.toLowerCase() &&
      suggestLocaleCookie === locale;
    const issuedForThisCountry =
      suggestCurrentCookie.toLowerCase() === country.toLowerCase();

    if (onSuggestedNow) {
      clearSuggestCookies(res);
    } else if (issuedForThisCountry) {
      setSuggestedCookies(
        res,
        suggestCountryCookie,
        suggestLocaleCookie,
        suggestCurrentCookie,
      );
    } else {
      clearSuggestCookies(res);
    }
  }
  return res;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Which shop: the request host (www. kept — it is a host of its own). On
  // localhost / *.vercel.app the dev shop (NEXT_PUBLIC_SHOP_DEV_HOST) stands in.
  const rawHost = normalizeShopHost(
    req.headers.get("host") || req.nextUrl.host,
  );
  const shopHost = resolveShopHost(
    rawHost,
    process.env.NEXT_PUBLIC_SHOP_DEV_HOST,
  );

  // Fixed host moves of a pack (www.grbpwr.com → grbpwr.com), as before.
  const staticTarget = rawHost ? staticHostRedirect(rawHost) : null;
  if (staticTarget) {
    const url = req.nextUrl.clone();
    url.host = staticTarget;
    url.port = "";
    return NextResponse.redirect(url, { status: 308 });
  }

  // Shared static files and the root route handlers (sitemaps, robots,
  // manifest, API catalog) read the host themselves.
  if (isSharedPublicFile(pathname)) return NextResponse.next();

  // Profile only where a 308 is possible (never on grbpwr's own hosts or dev).
  const redirectProfile =
    shopHost && rawHost && mayRedirectToPrimary(rawHost)
      ? await shopProfileForRedirect(shopHost)
      : null;
  const primary = rawHost
    ? primaryHostRedirect(rawHost, redirectProfile)
    : null;
  if (primary) {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.host = primary;
    url.port = "";
    return NextResponse.redirect(url, { status: 308 });
  }

  if (isRootRouteHandler(pathname)) return NextResponse.next();
  if (!shopHost) return notFound();
  const shop = {
    host: shopHost,
    pack: resolvePack(redirectProfile?.pack, shopHost),
  };

  // Pack files: root icons map to public/brands/<pack>; nobody else gets them.
  const packFile = packRootFile(pathname, shop.pack);
  if (packFile) {
    const url = req.nextUrl.clone();
    url.pathname = packFile;
    return NextResponse.rewrite(url);
  }
  if (isPackRootFileName(pathname)) return notFound();
  if (isPackPublicFile(pathname)) {
    return packPublicFileAllowed(pathname, shop.pack)
      ? NextResponse.next()
      : notFound();
  }

  // Markdown for Agents: when an agent explicitly asks for text/markdown,
  // serve a markdown overview of the homepage instead of the HTML app shell.
  // Browsers send `text/html`, so normal traffic is unaffected. Limited to the
  // homepage ("/" or "/{country}/{locale}") — other paths fall through to HTML.
  const isHomePathForMarkdown =
    pathname === "/" || /^\/[A-Za-z]{2}\/[a-z]{2}\/?$/.test(pathname);
  if (
    isHomePathForMarkdown &&
    (req.headers.get("accept") || "").includes("text/markdown")
  ) {
    return new NextResponse(homepageMarkdown(shop.host, shop.pack), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // get existing cookies
  const countryCookie = req.cookies.get("NEXT_COUNTRY")?.value;
  const localeCookie = req.cookies.get("NEXT_LOCALE")?.value;

  //define detected country
  const detectedCountry = detectCountry(req);

  //handle geo actions
  const geoResponse = handleGeoAction(req);
  if (geoResponse) return geoResponse;

  //handle country picker / update-location redirects (legitimate country switch)
  const fromPickerResponse = handleFromPickerAction(req);
  if (fromPickerResponse) return fromPickerResponse;

  //handle country/locale paths
  const parsedPath = parseCountryLocalePath(pathname);
  if (parsedPath) {
    const { country, locale, rest } = parsedPath;

    // The hero editor drives /preview/* inside an admin iframe and controls
    // the language purely via the URL locale. Exempt it from the NEXT_LOCALE
    // cookie override below (and from mutating the visitor's storefront
    // cookies) so the URL locale — the only signal the editor sends — wins.
    const isPreview =
      rest === "/preview" || (rest?.startsWith("/preview/") ?? false);

    // Site switched off: SiteGuard (client, from the cached hero) sends the
    // visitor home — no per-view backend round-trip here.

    if (!supportedCountries.includes(country!)) {
      const url = req.nextUrl.clone();
      url.pathname = `/gb/en${rest}`;
      return NextResponse.redirect(url, { status: 308 });
    }

    // URL is the source of truth: when /{country}/{locale} is a valid combo,
    // trust it and let setMainCookies (below) sync cookies to match. The previous
    // "block manual URL changes" guard caused legitimate refreshes of /fr/en to
    // revert to /fr/{cookieLocale} when the cookie hadn't caught up yet.
    // 307 (not 308) because the resolved locale can change with cookies.
    if (!(routing.locales as readonly string[]).includes(locale!)) {
      const fallbackLocale = getLocaleFromCountry(country!);
      const url = req.nextUrl.clone();
      url.pathname = `/${country}/${fallbackLocale}${rest}`;
      return NextResponse.redirect(url, { status: 307 });
    }

    // Language preference wins over the URL locale: a visitor who picked a
    // language (NEXT_LOCALE) keeps it even when opening a /{country}/{otherLocale}
    // URL — e.g. /de/de after choosing English redirects to /de/en. Deliberate
    // switches go through from_picker (handled above), which sets the cookie
    // first, so they don't bounce. New visitors / crawlers (no cookie) get the
    // URL as-is and the cookie is synced below.
    if (
      !isPreview &&
      localeCookie &&
      localeCookie !== locale &&
      (routing.locales as readonly string[]).includes(localeCookie)
    ) {
      const url = req.nextUrl.clone();
      url.pathname = `/${country}/${localeCookie}${rest}`;
      const res = NextResponse.redirect(url, { status: 307 });
      res.headers.set("Cache-Control", "no-store");
      setMainCookies(res, country!, localeCookie);
      return res;
    }

    return finalizeLocalizedResponse(
      req,
      shop,
      country!,
      locale!,
      rest ?? "",
      isPreview,
    );
  }

  // A bare /{country} (e.g. /gb, /us) must resolve to that country, not be
  // mistaken for a locale by the locale-only handling below (which treats any
  // two letters as a language). Redirect to the country's default language so
  // /gb -> /gb/en instead of /{geoCountry}/{geoLocale}.
  const bareCountry = pathname.match(/^\/([A-Za-z]{2})\/?$/);
  if (
    bareCountry &&
    supportedCountries.includes(bareCountry[1].toLowerCase())
  ) {
    const country = bareCountry[1].toLowerCase();
    // Keep the visitor's chosen language if they have one; only fall back to
    // the country's default for fresh visitors. Otherwise /de clobbered a
    // user's NEXT_LOCALE=en and forced /de/de (and the de cookie cascaded to
    // catalog/product links).
    const locale =
      localeCookie &&
      (routing.locales as readonly string[]).includes(localeCookie)
        ? localeCookie
        : getLocaleFromCountry(country);
    const url = req.nextUrl.clone();
    url.pathname = `/${country}/${locale}`;
    const res = NextResponse.redirect(url, { status: 307 });
    res.headers.set("Cache-Control", "no-store");
    setMainCookies(res, country, locale);
    return res;
  }

  //handle paths without country/locale (e.g. /, /en, /en/products)
  if (!/^\/[A-Za-z]{2}\/[a-z]{2}(?=\/|$)/.test(pathname)) {
    const targetCountry =
      countryCookie && supportedCountries.includes(countryCookie)
        ? countryCookie
        : getNormalizedCountry(detectedCountry);

    const localeOnly = parseLocaleOnlyPath(pathname);
    const targetLocale = localeOnly
      ? (routing.locales as readonly string[]).includes(localeOnly.locale)
        ? localeOnly.locale
        : localeCookie || getLocaleFromCountry(targetCountry)
      : localeCookie || getLocaleFromCountry(targetCountry);
    const pathRest = pathname === "/" ? "" : localeOnly?.rest ?? pathname;

    // /p/[handle] and /timeline/[handle] are locale-only routes (see
    // LOCALE_ONLY_DETAIL_REST above) — serve them at /{locale}/{rest}
    // without ever adding a {country} segment to the public URL. This is
    // what previously produced /de/en/p/... and /de/de/timeline/...
    // (a {country} hop bolted in front of an already-valid {locale} path).
    if (LOCALE_ONLY_DETAIL_REST.test(pathRest)) {
      const canonicalPath = `/${targetLocale}${pathRest}`;
      if (pathname === canonicalPath) {
        return finalizeLocalizedResponse(
          req,
          shop,
          targetCountry,
          targetLocale,
          pathRest,
          false,
        );
      }
      const url = req.nextUrl.clone();
      url.pathname = canonicalPath;
      const res = NextResponse.redirect(url, { status: 307 });
      res.headers.set("Cache-Control", "no-store");
      setMainCookies(res, targetCountry, targetLocale);
      return res;
    }

    // redirect to country/locale (preserve path when locale-only e.g. /en/products -> /us/en/products)
    // 307 + no-store so browsers/CDNs never cache /account -> /fr/fr/account when cookies later flip to en.
    const url = req.nextUrl.clone();
    url.pathname = `/${targetCountry}/${targetLocale}${pathRest}`;
    const res = NextResponse.redirect(url, { status: 307 });
    res.headers.set("Cache-Control", "no-store");
    // Ensure defaults are persisted for subsequent requests
    setMainCookies(res, targetCountry, targetLocale);
    return res;
  }
  // Unreachable (every /{xx}/{yy} path is handled above); fail closed rather
  // than let a path reach `[shop]` without the host prefix.
  return notFound();
}

// Every path that could reach src/app/[shop] must pass through here (dotted
// paths included): the rewrite above is what pins `[shop]` to the request
// host. Only API routes and Next/Vercel internals skip the middleware.
export const config = {
  matcher: "/((?!api/|_next/|_vercel/|__nextjs).*)",
};
