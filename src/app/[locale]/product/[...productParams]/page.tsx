import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";
import { LANGUAGE_CODE_TO_ID } from "@/constants";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { productJsonLd, productOfferForLocale } from "@/lib/structured-data";

import { LastViewedProducts } from "./_components/last-viewed-products";
import { MobileProductInfo } from "./_components/mobile-product-info";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";
import { ProductPageLayout } from "./_components/product-page-layout";

interface ProductPageProps {
  params: Promise<{
    locale: string;
    productParams: string[];
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; productParams: string[] }>;
}): Promise<Metadata> {
  const { productParams, locale } = await params;
  const [gender, brand, name, id] = productParams;
  const localeId = LANGUAGE_CODE_TO_ID[locale];

  const { product } = await serviceClient.GetProduct({
    gender,
    brand,
    name,
    id: parseInt(id),
  });

  const productMedia = [...(product?.media || [])];
  const productBody = product?.product?.productDisplay?.productBody;

  const title = productBody?.translations?.find(
    (t) => t.languageId === localeId,
  )?.name;
  const description = productBody?.translations?.find(
    (t) => t.languageId === localeId,
  )?.description;

  const color = productBody?.productBodyInsert?.color;
  const productImageUrl = productMedia[0]?.media?.compressed?.mediaUrl;

  // type:"product" suppresses the default og:type=website; og:type=product and
  // product:price:* are rendered as <meta property> JSX in the component below,
  // since Next's metadata API can't emit og:type=product.
  return generateCommonMetadata({
    title: title?.toUpperCase(),
    description: `${description}'\n'${color}`,
    locale,
    path: `/product/${gender}/${brand}/${name}/${id}`,
    ogParams: {
      type: "product",
      imageUrl: productImageUrl,
      imageAlt: `${title || "Product"} - ${color || ""}`.trim(),
    },
  });
}

export const dynamic = "force-static";

export default async function ProductPage({ params }: ProductPageProps) {
  const { productParams, locale } = await params;

  if (productParams.length !== 4) {
    return notFound();
  }

  const [gender, brand, name, id] = productParams;

  const { product } = await serviceClient.GetProduct({
    gender,
    brand,
    name,
    id: parseInt(id),
  });

  if (!product || !product.product) {
    notFound();
  }

  const productMedia = [...(product?.media || [])];
  const jsonLd = productJsonLd(product, locale);
  // Open Graph product tags. Rendered here (not via the metadata API, which
  // throws on og:type values outside its fixed union) as <meta property> JSX —
  // React hoists them into <head>.
  const offer = productOfferForLocale(product, locale);

  // Single descriptive H1 (the product name) rendered once at page level — both
  // the desktop and mobile info blocks are in the DOM (CSS-toggled), so putting
  // the H1 here avoids duplicate H1s. Visually hidden since the name already
  // shows in the info block.
  const localeId = LANGUAGE_CODE_TO_ID[locale];
  const productName =
    product?.product?.productDisplay?.productBody?.translations?.find(
      (t) => t.languageId === localeId,
    )?.name ||
    product?.product?.sku ||
    "";

  return (
    <ProductPageLayout>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        {product && <MobileProductInfo product={product} />}
      </div>
      <div className="hidden lg:block">
        <ProductImagesCarousel
          productMedia={productMedia}
          productId={product?.product?.sku || ""}
          productName={
            product?.product?.productDisplay?.productBody?.translations?.[0]
              ?.name || ""
          }
        />
        {product && <ProductInfo product={product} />}
        {product?.product && <LastViewedProducts product={product.product} />}
      </div>
    </ProductPageLayout>
  );
}
