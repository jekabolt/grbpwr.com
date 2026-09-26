"use client";

import { useEffect } from "react";

import { GA4_MEASUREMENT_ID } from "@/lib/analitycs/utils";

const GTM_ID = "GTM-WFC98J99";
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
function injectAnalytics() {
  // Inject the exact same snippets the layout previously rendered, just later —
  // using inline <script> text so command processing is byte-identical.

  // Consent Mode default — MUST run before GTM/GA4 load so storage is denied
  // until the visitor chooses. Establishes the canonical gtag stub, sets every
  // signal to denied, then upgrades to granted for a returning consented
  // visitor (read from localStorage) so they are not denied-then-granted.
  const consent = document.createElement("script");
  consent.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});(function(){try{var s=localStorage.getItem('cookieConsent');if(!s)return;var p=JSON.parse(s),u={};if(p.statistical){u.analytics_storage='granted';}if(p.advertising_social_media){u.ad_storage='granted';u.ad_user_data='granted';u.ad_personalization='granted';}if(Object.keys(u).length)gtag('consent','update',u);}catch(e){}})();`;
  document.head.appendChild(consent);

  // Google Tag Manager loader
  const gtm = document.createElement("script");
  gtm.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;
  document.head.appendChild(gtm);

  // GA4 library + init (canonical gtag stub)
  const gtagLib = document.createElement("script");
  gtagLib.async = true;
  gtagLib.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(gtagLib);

  const gtagInit = document.createElement("script");
  gtagInit.text = `gtag('js',new Date());gtag('config','${GA4_MEASUREMENT_ID}',{send_page_view:false});`;
  document.head.appendChild(gtagInit);
}

export function DeferredAnalytics() {
  useEffect(() => {
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
      injectAnalytics();
    }

    const timer = window.setTimeout(load, FALLBACK_MS);
    events.forEach((e) =>
      window.addEventListener(e, load, { once: true, passive: true }),
    );

    return cleanup;
  }, []);

  return null;
}
