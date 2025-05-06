import { Metadata } from "next";

import { getProduct } from "@/lib/cached-data";
import { generateCommonMetadata } from "@/lib/common-metadata";

import { MobileImageCarousel } from "./_components/mobile-image-carousel";
import { MobileProductInfo } from "./_components/mobile-product-info";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";

interface ProductPageProps {
  params: Promise<{
    productParams: string[];
  }>;
}

// Set revalidation time - pages will be cached but revalidated after this time (in seconds)
// Using a long duration like 1 week, adjust as needed for your use case
export const revalidate = 604800; // 7 days

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productParams } = await params;
  const [gender, brand, name, id] = productParams;

  const product = await getProduct(gender, brand, name, parseInt(id));

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

// Return empty array to enable on-demand ISR
// Instead of pre-generating all paths at build time, pages will be generated and cached on first visit
export async function generateStaticParams() {
  // Return empty array - don't pre-generate any pages at build time
  return [];

  /* Original implementation - kept for reference
  try {
    // Fetch all products that should be statically generated
    const { products = [] } = await getProductsPaged(
      MAX_LIMIT,
      0,
      undefined,
      undefined,
      undefined
    ) || { products: [] };

    // Transform the product data into path params
    return products
      .filter(
        (product) =>
          product.productDisplay?.productBody?.targetGender &&
          product.productDisplay?.productBody?.brand &&
          product.productDisplay?.productBody?.name &&
          product.id,
      )
      .map((product) => ({
        productParams: [
          product.productDisplay?.productBody?.targetGender || "",
          product.productDisplay?.productBody?.brand || "",
          product.productDisplay?.productBody?.name || "",
          product.id?.toString() || "",
        ],
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
  */
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const { productParams } = params;

  // if (productParams.length !== 4) {
  //   return notFound();
  // }

  const [gender, brand, name, id] = productParams;

  // Use the cached function instead of direct service client call
  const product = await getProduct(gender, brand, name, parseInt(id));

  const productMedia = [...(product?.media || [])];

  return (
    <>
      {/* <FlexibleLayout
      //   mobileHeaderType="flexible"
      //   headerType="catalog"
      //   footerType="mini"
      //   transparent
      > */}
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
      {/* </FlexibleLayout> */}
    </>
  );
}
