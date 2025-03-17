import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";
import { MAX_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
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

export async function generateMetadata(
  props: ProductPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const { productParams } = params;

  const [gender, brand, name, id] = productParams;

  try {
    const { product } = await serviceClient.GetProduct({
      gender,
      brand,
      name,
      id: parseInt(id),
    });

    const productBody = product?.product?.productDisplay?.productBody;
    const productBrand = productBody?.brand;
    const productName = productBody?.name || "";
    const productDescription = productBody?.description || "";
    const productColor = productBody?.color || "";
    const thumbnailUrl =
      product?.product?.productDisplay?.thumbnail?.media?.thumbnail?.mediaUrl ||
      "";

    return {
      title: `${productBrand}: ${productName}`.toUpperCase(),
      description: "product information",
      openGraph: {
        siteName: "grbpwr",
        images: thumbnailUrl,
        title: productName,
        description: `${productDescription}\nSupplier color: ${productColor}`,
      },
    };
  } catch (error) {
    return {
      title: "grbpwr",
      description: "Product not found",
    };
  }
}

export async function generateStaticParams() {
  const response = await serviceClient.GetProductsPaged({
    limit: MAX_LIMIT,
    offset: 0,
    sortFactors: undefined,
    orderFactor: undefined,
    filterConditions: undefined,
  });

  return (
    response.products?.map((product) => ({
      slug: product.slug?.replace("product/", "").split("/") || [],
    })) || []
  );
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
      {product?.product && <LastViewedProducts product={product.product} />}
    </FlexibleLayout>
  );
}
