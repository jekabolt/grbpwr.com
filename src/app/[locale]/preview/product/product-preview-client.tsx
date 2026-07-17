"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { common_ColorwayFull } from "@/api/proto-http/frontend";

import { Text } from "@/components/ui/text";
import { MobileProductInfo } from "@/app/[locale]/p/[handle]/_components/mobile-product-info";
import { ProductImagesCarousel } from "@/app/[locale]/p/[handle]/_components/product-images-carousel";
import { ProductInfo } from "@/app/[locale]/p/[handle]/_components/product-info";
import { ProductPageLayout } from "@/app/[locale]/p/[handle]/_components/product-page-layout";

import { ADMIN_ORIGINS } from "../_components/admin-origins";
import { PreviewBoundary } from "../_components/preview-boundary";

// Live preview of a single product the admin is editing. Mirrors the hero
// preview: an origin-gated postMessage bridge receives `product-draft` messages
// ({ product, rev }) and renders them through the real product page layout +
// info/carousel components, so the editor sees exactly how the item will look.
// The page-level "last viewed" strip and SEO/JSON-LD are intentionally dropped
// here — they aren't part of the item under edit. See hero preview for the
// protocol rationale (ready handshake, stale-rev drop, error boundary).
type ProductDraftMessage = {
  type: "product-draft";
  product: common_ColorwayFull;
  rev: number;
};

export function ProductPreviewClient() {
  const [product, setProduct] = useState<common_ColorwayFull | null>(null);
  // Latest applied revision — a ref so the listener drops stale/out-of-order
  // drafts without being torn down and re-subscribed each update.
  const revRef = useRef(-1);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!ADMIN_ORIGINS.includes(e.origin)) return; // origin gate
      const msg = e.data as Partial<ProductDraftMessage> | null;
      if (!msg || msg.type !== "product-draft" || !msg.product) return;
      if (typeof msg.rev === "number" && msg.rev <= revRef.current) return;
      revRef.current = typeof msg.rev === "number" ? msg.rev : revRef.current;
      setProduct(msg.product);
    }

    window.addEventListener("message", onMessage);
    // Handshake: tell the editor the bridge is mounted so it replays the current
    // draft immediately. Targeted origins only — never "*".
    for (const origin of ADMIN_ORIGINS) {
      window.parent?.postMessage({ type: "product-preview-ready" }, origin);
    }
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Keep the preview pinned: a stray click on an internal link would navigate the
  // iframe away from the canvas. Cancel navigation for anchors only (in the
  // capture phase) so interactive controls (size picker, etc.) keep working.
  function onLinkClickCapture(e: ReactMouseEvent) {
    if ((e.target as HTMLElement | null)?.closest?.("a[href]")) {
      e.preventDefault();
    }
  }

  if (!product || !product.colorway) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bgColor p-6">
        <Text variant="uppercase">waiting for editor…</Text>
      </div>
    );
  }

  const productMedia = [...(product.media || [])];
  const productName =
    product.colorway.display?.productBody?.translations?.[0]?.name || "";

  return (
    <PreviewBoundary
      resetKey={product}
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-bgColor p-6">
          <Text variant="uppercase">
            render error — waiting for next draft…
          </Text>
        </div>
      }
    >
      <div style={{ display: "contents" }} onClickCapture={onLinkClickCapture}>
        <ProductPageLayout>
          <div className="block lg:hidden">
            <MobileProductInfo product={product} />
          </div>
          <div className="hidden lg:block">
            <ProductImagesCarousel
              productMedia={productMedia}
              productId={product.colorway.baseSku || ""}
              productName={productName}
            />
            <ProductInfo product={product} />
          </div>
        </ProductPageLayout>
      </div>
    </PreviewBoundary>
  );
}
