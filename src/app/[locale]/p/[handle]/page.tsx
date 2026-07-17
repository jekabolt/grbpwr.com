import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";
import { GENDER_MAP_REVERSE, LANGUAGE_CODE_TO_ID } from "@/constants";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { baseSkuFromHandle } from "@/lib/slug-tail";
import {
  jsonLdHtml,
  productJsonLd,
  productOfferForLocale,
} from "@/lib/structured-data";

import { LastViewedProducts } from "./_components/last-viewed-products";
import { MobileProductInfo } from "./_components/mobile-product-info";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";
import { ProductPageLayout } from "./_components/product-page-layout";

interface ProductPageProps {
  params: Promise<{
    locale: string;
    handle: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { handle, locale } = await params;
  const localeId = LANGUAGE_CODE_TO_ID[locale];

  const baseSku = baseSkuFromHandle(handle);
  const { colorway } = baseSku
    ? await serviceClient.GetColorway({ baseSku })
    : { colorway: undefined };

  const productMedia = [...(colorway?.media || [])];
  const translations = colorway?.display?.translations;

  const title = translations?.find((t) => t.languageId === localeId)?.name;
  const description = translations?.find(
    (t) => t.languageId === localeId,
  )?.description;

  const color = colorway?.colorCode;
  // Use the product's thumbnail (compressed) as the link-preview image, falling
  // back to the first gallery media if no thumbnail is set.
  const productImage =
    colorway?.display?.thumbnail?.media?.compressed ??
    productMedia[0]?.media?.compressed;

  // type:"product" suppresses the default og:type=website; og:type=product and
  // product:price:* are rendered as <meta property> JSX in the component below,
  // since Next's metadata API can't emit og:type=product.
  return generateCommonMetadata({
    title: title?.toUpperCase(),
    description: `${description}'\n'${color}`,
    locale,
    path: `/p/${handle}`,
    // Small preview for product links (square thumbnail), not a large card.
    twitterCard: "summary",
    ogParams: {
      type: "product",
      imageUrl: productImage?.mediaUrl,
      // Real dimensions so social cards crop accurately (omitted if unknown).
      imageWidth: productImage?.width || undefined,
      imageHeight: productImage?.height || undefined,
      imageAlt: `${title || "Product"} - ${color || ""}`.trim(),
    },
  });
}

export const dynamic = "force-static";

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle, locale } = await params;

  const baseSku = baseSkuFromHandle(handle);
  if (!baseSku) {
    notFound();
  }

  const { colorway } = await serviceClient.GetColorway({ baseSku });

  if (!colorway) {
    notFound();
  }

  const productMedia = [...(colorway.media || [])];
  const jsonLd = productJsonLd(colorway, locale);
  // Open Graph product tags. Rendered here (not via the metadata API, which
  // throws on og:type values outside its fixed union) as <meta property> JSX —
  // React hoists them into <head>.
  const offer = productOfferForLocale(colorway, locale);

  // Single descriptive H1 (the product name) rendered once at page level — both
  // the desktop and mobile info blocks are in the DOM (CSS-toggled), so putting
  // the H1 here avoids duplicate H1s. Visually hidden since the name already
  // shows in the info block.
  const localeId = LANGUAGE_CODE_TO_ID[locale];
  const productName =
    colorway.display?.translations?.find((t) => t.languageId === localeId)
      ?.name ||
    colorway.baseSku ||
    "";

  // The gender segment is no longer in the URL; derive the back-nav fallback
  // catalog from the colorway's target gender.
  const targetGender = colorway.display?.targetGender;
  const gender = targetGender ? GENDER_MAP_REVERSE[targetGender] : undefined;

  return (
    <ProductPageLayout gender={gender}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
        />
      )}
      <meta property="og:type" content="product" />
      {offer && (
        <>
          <meta property="product:price:amount" content={offer.price} />
          <meta property="product:price:currency" content={offer.currency} />
        </>
      )}
      {productName && <h1 className="sr-only">{productName}</h1>}
      <div className="block lg:hidden">
        <MobileProductInfo product={colorway} />
      </div>
      <div className="hidden lg:block">
        <ProductImagesCarousel
          productMedia={productMedia}
          productId={colorway.baseSku || ""}
          productName={colorway.display?.translations?.[0]?.name || ""}
        />
        <ProductInfo product={colorway} />
        <LastViewedProducts product={colorway} />
      </div>
    </ProductPageLayout>
  );
}
