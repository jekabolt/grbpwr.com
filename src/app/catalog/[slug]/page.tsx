import Image from "@/components/global/Image";
import CoreLayout from "@/components/layouts/CoreLayout";
import { MAX_LIMIT, currencyMap } from "@/constants";
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

  return response.products?.map((product) => ({
    slug: product.slug,
  }));
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
    <CoreLayout>
      <div className="flex flex-col bg-white pb-20 pt-5">
        <div className="flex w-full flex-wrap items-end">
          {/* First column, adjusts with screen size */}
          <div className="flex h-[400px] w-full flex-col justify-end sm:w-1/2 md:h-[400px] md:w-1/6">
            {product?.media?.[0]?.productMediaInsert?.fullSize && (
              <Image
                src={product.media[0].productMediaInsert.fullSize}
                alt="Product image"
                aspectRatio="4/3"
              />
            )}
          </div>

          {/* Second column, adjusts with screen size */}
          <div className="flex h-[800px] w-full flex-col sm:w-1/2 md:w-1/3">
            {product?.media?.[1]?.productMediaInsert?.fullSize && (
              <Image
                src={product.media[1].productMediaInsert.fullSize}
                alt="Product image"
                aspectRatio="4/3"
              />
            )}
          </div>

          {/* Third column, adjusts with screen size */}
          <div className="flex h-[800px] w-full flex-col sm:w-1/2 md:w-1/3">
            {product?.media?.[2]?.productMediaInsert?.fullSize && (
              <Image
                src={product.media[2].productMediaInsert.fullSize}
                alt="Product image"
                aspectRatio="4/3"
              />
            )}
          </div>

          {/* Fourth column, adjusts with screen size */}
          <div className="flex h-[400px] w-full flex-col justify-end sm:w-1/2 md:h-[400px] md:w-1/6">
            {product?.media?.[3]?.productMediaInsert?.fullSize && (
              <Image
                src={product.media[3].productMediaInsert.fullSize}
                alt="Product image"
                aspectRatio="4/3"
              />
            )}
          </div>
        </div>

        <div className="flex w-1/2 flex-col ">
          <div className="mt-4 flex justify-between">
            <div>{product?.product?.productInsert?.name}</div>
            <div>
              {product?.product?.productInsert?.price?.value}
              {currencyMap.eth}
            </div>
          </div>
          <div className="mt-4">
            {product?.product?.productInsert?.description}
          </div>
          <div className="mt-4">Measurements</div>
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
