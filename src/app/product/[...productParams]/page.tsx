import { notFound } from "next/dist/client/components/not-found";
import { MAX_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";

import { LastViewedProducts } from "./_components/last-viewed-products";
import { MobileImageCarousel } from "./_components/mobile-image-carousel";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";

interface ProductPageProps {
  params: Promise<{
    productParams: string[];
  }>;
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
    <FlexibleLayout headerType="catalog" footerType="mini" className="lg:pt-16">
      <div className="relative">
        <div className="block lg:hidden">
          <MobileImageCarousel media={productMedia} />
        </div>
        <div className="hidden lg:block">
          <ProductImagesCarousel productMedia={productMedia} />
        </div>
        {product && (
          <ProductInfo
            product={product}
            className="p-2.5 lg:absolute lg:bottom-[130px] lg:right-32 lg:p-0"
          />
        )}
      </div>
      {product?.product && <LastViewedProducts product={product.product} />}
    </FlexibleLayout>
  );
}
