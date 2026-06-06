"use client";

import { useEffect } from "react";

import { GA4_MEASUREMENT_ID } from "@/lib/analitycs/utils";

const GTM_ID = "GTM-WFC98J99";
// Load no later than this even without interaction, so bots/quick-bouncing
// visitors are still measured.
const FALLBACK_MS = 6000;

// Loads GTM + gtag only after the first user interaction (or an idle fallback),
// keeping ~125ms of third-party script work off the main thread during the
// initial load — the biggest TBT contributor. Tracking behaviour is otherwise
// identical to the previous inline scripts.
function injectAnalytics() {
  // Inject the exact same snippets the layout previously rendered, just later —
  // using inline <script> text so command processing is byte-identical.

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
  gtagInit.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_MEASUREMENT_ID}',{send_page_view:false});`;
  document.head.appendChild(gtagInit);
}

export function DeferredAnalytics() {
  useEffect(() => {
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
