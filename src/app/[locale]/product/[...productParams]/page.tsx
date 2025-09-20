// app/product/[...productParams]/page.tsx

import { notFound } from "next/dist/client/components/not-found";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";

import { LastViewedProducts } from "./_components/last-viewed-products";
import { MobileProductInfo } from "./_components/mobile-product-info";
import { ProductImagesCarousel } from "./_components/product-images-carousel";
import { ProductInfo } from "./_components/product-info";

interface ProductPageProps {
  params: Promise<{
    productParams: string[];
  }>;
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
    <FlexibleLayout
      mobileHeaderType="flexible"
      headerType="catalog"
      displayFooter={false}
      headerProps={{
        left: `<`,
        link: "/catalog",
      }}
    >
      <div className="block lg:hidden">
        {product && <MobileProductInfo product={product} />}
      </div>
      <div className="hidden lg:block">
        <ProductImagesCarousel productMedia={productMedia} />
        {product && <ProductInfo product={product} />}
        {product?.product && <LastViewedProducts product={product.product} />}
      </div>
    </FlexibleLayout>
  );
}
