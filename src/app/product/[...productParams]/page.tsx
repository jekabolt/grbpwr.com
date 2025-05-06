import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/dist/client/components/not-found";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";

import { LastViewedProducts } from "./_components/last-viewed-products";
import { MobileImageCarousel } from "./_components/mobile-image-carousel";
import { MobileProductInfo } from "./_components/mobile-product-info";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";

// Create a cached version of product fetch using unstable_cache
const getProductCached = unstable_cache(
  async (gender: string, brand: string, name: string, id: string) => {
    console.log(
      `[Cached API] Fetching product: ${gender}/${brand}/${name}/${id}`,
    );
    return serviceClient.GetProduct({
      gender,
      brand,
      name,
      id: parseInt(id),
    });
  },
  // Key generator for the cache
  ["product-data"],
  // Options
  {
    revalidate: 3600,
    tags: ["product"],
  },
);

interface ProductPageProps {
  params: Promise<{
    productParams: string[];
  }>;
}

export async function generateStaticParams() {
  // Return an empty array to enable on-demand ISR
  // Pages will be statically generated on first visit
  return [];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productParams } = await params;
  const [gender, brand, name, id] = productParams;

  // Use cached fetch
  const { product } = await getProductCached(gender, brand, name, id);

  const productMedia = [...(product?.media || [])];
  const title = product?.product?.productDisplay?.productBody?.name;
  const description =
    product?.product?.productDisplay?.productBody?.description;
  const color = product?.product?.productDisplay?.productBody?.color;
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

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const { productParams } = params;

  if (productParams.length !== 4) {
    return notFound();
  }

  const [gender, brand, name, id] = productParams;

  console.log(
    `[ProductPage] Rendering product: ${gender}/${brand}/${name}/${id}`,
  );

  // Use the cached fetch function here too
  const { product } = await getProductCached(gender, brand, name, id);

  const productMedia = [...(product?.media || [])];

  return (
    <FlexibleLayout
      mobileHeaderType="flexible"
      headerType="catalog"
      footerType="mini"
      transparent
    >
      <div className="relative lg:h-screen">
        <div className="block lg:hidden">
          <MobileImageCarousel media={productMedia} />
        </div>
        <div className="hidden h-full w-full pt-12 lg:block">
          <ProductImagesCarousel productMedia={productMedia} />
        </div>
        <div className="hidden lg:block">
          {product && <ProductInfo product={product} />}
        </div>
        <div className="block lg:hidden">
          {product && <MobileProductInfo product={product} />}
        </div>
      </div>
      {product?.product && <LastViewedProducts product={product.product} />}
    </FlexibleLayout>
  );
}
