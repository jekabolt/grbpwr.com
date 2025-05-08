// app/product/[...productParams]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MAX_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";

import { LastViewedProducts } from "./_components/last-viewed-products";
import { MobileImageCarousel } from "./_components/mobile-image-carousel";
import { MobileProductInfo } from "./_components/mobile-product-info";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";

interface ProductPageProps {
  params: Promise<{
    productParams: string[];
  }>;
}

// For static site generation, we need to provide the paths
// that should be generated at build time
// You need to implement or modify your API to provide a list of all products
// This is a placeholder implementation - replace with actual data source
export async function generateStaticParams() {
  try {
    const response = await serviceClient.GetProductsPaged({
      limit: MAX_LIMIT,
      offset: 0,
      sortFactors: undefined,
      orderFactor: undefined,
      filterConditions: undefined,
    });

    if (!response.products || response.products.length === 0) {
      console.log("No products found for static generation");
      return [];
    }

    console.log(
      `Generating static params for ${response.products.length} products`,
    );

    return response.products.map((product) => {
      const gender = product.productDisplay?.productBody?.targetGender;
      const brand = product.productDisplay?.productBody?.brand;
      const name = product.productDisplay?.productBody?.name;
      const id = product.id?.toString() || "0";

      return {
        productParams: [gender, brand, name, id],
      };
    });
  } catch (error) {
    console.error("Error generating static params for products:", error);
    return [];
  }
}

const getProductData = async (
  gender: string,
  brand: string,
  name: string,
  id: string,
) => {
  const startTime = Date.now();
  const result = await serviceClient.GetProduct({
    gender,
    brand,
    name,
    id: parseInt(id),
  });
  console.log(`Fetch time: ${Date.now() - startTime}ms`);
  return result;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productParams } = await params;
  const [gender, brand, name, id] = productParams;

  const { product } = await getProductData(gender, brand, name, id);

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

export default async function ProductPage({ params }: ProductPageProps) {
  const { productParams } = await params;

  if (productParams.length !== 4) {
    return notFound();
  }

  const [gender, brand, name, id] = productParams;
  const { product } = await getProductData(gender, brand, name, id);
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
