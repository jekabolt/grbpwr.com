import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";

import { LastViewedProducts } from "./_components/last-viewed-products";
import { MobileImageCarousel } from "./_components/mobile-image-carousel";
import { MobileProductInfo } from "./_components/mobile-product-info";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";

// Configure ISR (Incremental Static Regeneration)
export const revalidate = 3600; // 1 hour

async function getProduct(
  gender: string,
  brand: string,
  name: string,
  id: string,
) {
  console.log(`[API] Fetching product: ${gender}/${brand}/${name}/${id}`);

  return serviceClient.GetProduct({
    gender,
    brand,
    name,
    id: parseInt(id),
  });
}

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

  // Fetch product data
  const { product } = await getProduct(gender, brand, name, id);

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

  // Fetch product data
  const { product } = await getProduct(gender, brand, name, id);

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
