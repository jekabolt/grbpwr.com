import { notFound } from "next/navigation";
import { MAX_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import { ProductMediaItem } from "@/components/images-carousel/ProductMediaItem";

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
    <div>
      <div className="relative grid h-screen w-full grid-cols-2">
        {productMedia.map((m) => (
          <div key={m.id} className="col-span-1 h-full">
            <ProductMediaItem singleMedia={m} />
          </div>
        ))}
      </div>

      {product && (
        <ProductInfo product={product} className="absolute bottom-5 right-32" />
      )}
    </div>
  );
}
