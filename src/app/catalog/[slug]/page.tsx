import { addItemToCookie } from "@/actions/cart";
import { MediaProvider } from "@/components/global/MediaProvider";
import { ProductMediaItem } from "@/components/global/MediaProvider/ProductMediaItem";
import CoreLayout from "@/components/layouts/CoreLayout";
import AddToCartButton from "@/components/productPage/AddToCartButton";
import { CURRENCY_MAP, MAX_LIMIT } from "@/constants";
import { serviceClient } from "@/lib/api";
import { Suspense } from "react";

interface ProductPageProps {
  params: {
    slug: string;
  };
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
      slug: product.slug!,
    })) || []
  );
}

const catalogData = [
  { label: "cloth", separator: "/" },
  { label: "Jackets & Coats", separator: "/" },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  const { product } = await serviceClient.GetProduct({
    slug,
  });

  return (
    <CoreLayout hideForm>
      <div className="flex flex-col bg-white pb-20 pt-5">
        {product?.media && (
          <div className="grid w-full grid-cols-6 items-end gap-2">
            <MediaProvider
              mediaList={product.media}
              ItemComponent={ProductMediaItem}
            />
          </div>
        )}
        <div className="flex w-1/2 flex-col ">
          <div className="mt-4 flex justify-between">
            <div>{product?.product?.productDisplay?.productBody?.name}</div>
            <div>
              {product?.product?.productDisplay?.productBody?.price?.value}
              {CURRENCY_MAP.eth}
            </div>
          </div>
          <div className="mt-4">
            {product?.product?.productDisplay?.productBody?.description}
          </div>
          <div className="mt-4">measurements</div>
          <div className="mt-4 flex justify-between gap-2">
            <div className="flex gap-2">
              {product?.sizes?.map((size) => (
                <div key={size.id}>{size.sizeId}</div>
              ))}
            </div>
            <Suspense>
              {/* TO-DO pass size from form */}
              <AddToCartButton
                slug={slug}
                size="size2"
                addItemToCookie={addItemToCookie}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </CoreLayout>
  );
}
