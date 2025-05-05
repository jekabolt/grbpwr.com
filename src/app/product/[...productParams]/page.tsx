import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";

import { MobileImageCarousel } from "./_components/mobile-image-carousel";
import { MobileProductInfo } from "./_components/mobile-product-info";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";

interface ProductPageProps {
  params: Promise<{
    productParams: string[];
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productParams } = await params;
  const [gender, brand, name, id] = productParams;

  const { product } = await serviceClient.GetProduct({
    gender,
    brand,
    name,
    id: parseInt(id),
  });

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

export const revalidate = false;

export async function generateStaticParams() {
  return [];
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const { productParams } = params;

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
      {/* {product?.product && <LastViewedProducts product={product.product} />} */}
    </FlexibleLayout>
  );
}
