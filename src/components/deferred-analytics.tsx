"use client";

import { useEffect } from "react";

import { setGa4MeasurementId } from "@/lib/analitycs/utils";

// Load no later than this even without interaction, so bots/quick-bouncing
// visitors are still measured.
const FALLBACK_MS = 6000;

// Keep dev/localhost traffic out of the production GA property. Local hosts are
// never measured; anything else only when this is a production build. (Preview/
// beta deploys are intentionally left measurable.)
function analyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  const isLocalHost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local");
  if (isLocalHost) return false;
  return process.env.NODE_ENV === "production";
}

// Loads GTM + gtag only after the first user interaction (or an idle fallback),
// keeping ~125ms of third-party script work off the main thread during the
// initial load — the biggest TBT contributor. Tracking behaviour is otherwise
// identical to the previous inline scripts.
function injectAnalytics(gtmId: string | undefined, ga4Id: string | undefined) {
  // Inject the exact same snippets the layout previously rendered, just later —
  // using inline <script> text so command processing is byte-identical.

  // Google Tag Manager loader
  if (gtmId) {
    const gtm = document.createElement("script");
    gtm.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
    document.head.appendChild(gtm);
  }

  // GA4 library + init (canonical gtag stub)
  if (ga4Id) {
    const gtagLib = document.createElement("script");
    gtagLib.async = true;
    gtagLib.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.appendChild(gtagLib);

    const gtagInit = document.createElement("script");
    gtagInit.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}',{send_page_view:false});`;
    document.head.appendChild(gtagInit);
  }
}

const ANALYTICS_ID = /^(GTM|G)-[A-Z0-9]{4,16}$/;

/**
 * Ids come from the shop's pack (grbpwr) only; a shop without them loads no
 * analytics at all, so no shop ever reports into another shop's property.
 */
export function DeferredAnalytics({
  gtmId: rawGtmId,
  ga4Id: rawGa4Id,
}: {
  gtmId?: string;
  ga4Id?: string;
}) {
  const gtmId = rawGtmId && ANALYTICS_ID.test(rawGtmId) ? rawGtmId : undefined;
  const ga4Id = rawGa4Id && ANALYTICS_ID.test(rawGa4Id) ? rawGa4Id : undefined;
  // Order submit asks gtag for the GA4 client id of this property (if any).
  setGa4MeasurementId(ga4Id);

  useEffect(() => {
    if (!gtmId && !ga4Id) return;
    if (!analyticsAllowed()) return;

    let loaded = false;
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    };

    function load() {
      if (loaded) return;
      loaded = true;
      cleanup();
      injectAnalytics(gtmId, ga4Id);
    }

    const timer = window.setTimeout(load, FALLBACK_MS);
    events.forEach((e) =>
      window.addEventListener(e, load, { once: true, passive: true }),
    );

    return cleanup;
  }, [gtmId, ga4Id]);

  return null;
}
