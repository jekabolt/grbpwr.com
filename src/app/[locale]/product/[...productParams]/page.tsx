import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";
import { LANGUAGE_CODE_TO_ID } from "@/constants";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";

import { LastViewedProducts } from "./_components/last-viewed-products";
import { MobileProductInfo } from "./_components/mobile-product-info";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";
import { ProductPageLayout } from "./_components/product-page-layout";

interface ProductPageProps {
  params: Promise<{
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

  return generateCommonMetadata({
    title: title?.toUpperCase(),
    description: `${description}'\n'${color}`,
    ogParams: {
      imageUrl: productImageUrl,
      imageAlt: `${title || "Product"} - ${color || ""}`.trim(),
    },
  });
}

export const dynamic = "force-static";

export default async function ProductPage({ params }: ProductPageProps) {
  const { productParams } = await params;

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

  const productMedia = [...(product?.media || [])];

  return (
    <ProductPageLayout>
      <div className="block lg:hidden">
        {product && <MobileProductInfo product={product} />}
      </div>
      <div className="hidden lg:block">
        <ProductImagesCarousel productMedia={productMedia} />
        {product && <ProductInfo product={product} />}
        {product?.product && <LastViewedProducts product={product.product} />}
      </div>
    </ProductPageLayout>
  );
}
