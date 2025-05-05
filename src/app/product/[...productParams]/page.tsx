import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";

import { MobileImageCarousel } from "./_components/mobile-image-carousel";
import { MobileProductInfo } from "./_components/mobile-product-info";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";

// Map gender enum values to string values for URLs
const genderEnumToString: Record<string, string> = {
  GENDER_ENUM_MALE: "men",
  GENDER_ENUM_FEMALE: "women",
  GENDER_ENUM_UNISEX: "unisex",
};

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

export async function generateStaticParams() {
  try {
    // Fetch all products with a high limit to get as many as possible in one request
    const { products } = await serviceClient.GetProductsPaged({
      limit: 1000, // Use a high limit to get as many products as possible
      offset: 0,
      sortFactors: undefined,
      orderFactor: undefined,
      filterConditions: undefined,
    });

    if (!products || products.length === 0) {
      return [];
    }

    // Map products to their URL parameters
    return products
      .map((product) => {
        const genderEnumString =
          product?.productDisplay?.productBody?.targetGender?.toString() || "";
        const gender = genderEnumToString[genderEnumString] || "";
        const brand = product?.productDisplay?.productBody?.brand || "";
        const name = product?.slug || "";
        const id = product?.id?.toString() || "";

        return {
          productParams: [gender, brand, name, id],
        };
      })
      .filter(
        (params) =>
          params.productParams[0] &&
          params.productParams[1] &&
          params.productParams[2] &&
          params.productParams[3],
      );
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
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
