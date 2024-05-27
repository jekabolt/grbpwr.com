import { MediaProvider } from "@/components/global/MediaProvider";
import { ProductMediaProviderItem } from "@/components/global/MediaProvider/ProductMediaProviderItem";
import CoreLayout from "@/components/layouts/CoreLayout";
import { CURRENCY_MAP, MAX_LIMIT } from "@/constants";
import { serviceClient } from "@/lib/api";

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
  const { product } = await serviceClient.GetProduct({
    slug: params.slug,
  });

  return (
    <CoreLayout hideForm>
      <div className="flex flex-col bg-white pb-20 pt-5">
        {product?.media && (
          <div className="grid w-full grid-cols-6 items-end gap-2">
            <MediaProvider
              mediaList={product.media}
              ItemComponent={ProductMediaProviderItem}
            />
            ;
          </div>
        )}
        <div className="flex w-1/2 flex-col ">
          <div className="mt-4 flex justify-between">
            <div>{product?.product?.productInsert?.name}</div>
            <div>
              {product?.product?.productInsert?.price?.value}
              {CURRENCY_MAP.eth}
            </div>
          </div>
          <div className="mt-4">
            {product?.product?.productInsert?.description}
          </div>
          <div className="mt-4">measurements</div>
          <div className="mt-4 flex justify-between gap-2">
            <div className="flex gap-2">
              {product?.sizes?.map((size) => (
                <div key={size.id}>{size.sizeId}</div>
              ))}
            </div>
            <button className="block w-36 bg-textColor px-1.5 text-center text-sm text-buttonTextColor">
              add to cart
            </button>
          </div>
        </div>
      </div>
    </CoreLayout>
  );
}
