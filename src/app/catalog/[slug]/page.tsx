import Image from "@/components/global/Image";
import CoreLayout from "@/components/layouts/CoreLayout";
import { CURRENCY_MAP, MAX_LIMIT } from "@/constants";
import { serviceClient } from "@/lib/api";
import { calculateAspectRatio } from "@/lib/utils";

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
        <div className="flex h-auto w-full flex-wrap items-end">
          {/* TO-DO set width based on screen size */}

          {product?.media?.[0]?.media?.fullSize && (
            <div className="flex h-full w-1/6 flex-col justify-end">
              <Image
                src={product?.media?.[0]?.media?.fullSize.mediaUrl!}
                alt="Product image"
                aspectRatio={calculateAspectRatio(
                  product?.media?.[0]?.media?.fullSize.width,
                  product?.media?.[0]?.media?.fullSize.height,
                )}
              />
            </div>
          )}

          {product?.media?.[1]?.media?.fullSize && (
            <div className="flex h-full w-1/3 flex-col">
              <Image
                src={product?.media?.[1]?.media?.fullSize.mediaUrl!}
                alt="Product image"
                aspectRatio={calculateAspectRatio(
                  product?.media?.[1]?.media?.fullSize.width,
                  product?.media?.[1]?.media?.fullSize.height,
                )}
              />
            </div>
          )}

          {product?.media?.[2]?.media?.fullSize && (
            <div className="flex h-full w-1/3 flex-col ">
              <Image
                src={product?.media?.[2]?.media?.fullSize.mediaUrl!}
                alt="Product image"
                aspectRatio={calculateAspectRatio(
                  product?.media?.[2]?.media?.fullSize.width,
                  product?.media?.[2]?.media?.fullSize.height,
                )}
              />
            </div>
          )}

          {product?.media?.[3]?.media?.fullSize && (
            <div className="flex h-full w-1/6 flex-col justify-end ">
              <Image
                src={product?.media?.[3]?.media?.fullSize.mediaUrl!}
                alt="Product image"
                aspectRatio={calculateAspectRatio(
                  product?.media?.[3]?.media?.fullSize.width,
                  product?.media?.[3]?.media?.fullSize.height,
                )}
              />
            </div>
          )}
        </div>

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
