import { notFound } from "next/navigation";
import { CURRENCY_MAP, MAX_LIMIT } from "@/constants";

// import { addCartProduct } from "@/lib/actions/cart";
import { serviceClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { FullscreenImagesCarousel } from "@/components/images-carousel";
import { ProductMediaItem } from "@/components/images-carousel/ProductMediaItem";
import NavigationLayout from "@/app/_components/navigation-layout";

import MeasurementsModal from "./_components/measurements-modal";
import AddToCartForm from "./_components/select-size-add-to-cart";

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

const catalogData = [
  { label: "cloth", separator: "/" },
  { label: "Jackets & Coats", separator: "/" },
];

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

  const baseCurrencyPrice =
    product?.product?.productDisplay?.productBody?.price?.value;

  const productMedia = [...(product?.media || []), ...(product?.media || [])];

  return (
    <NavigationLayout>
      <div className="grid grid-cols-10 items-end gap-1">
        {productMedia.map((m) => (
          <div
            key={m.id}
            className={cn({
              "col-span-3 first:col-span-2 last:col-span-2":
                productMedia.length === 4,
              "col-span-4 first:col-span-3 last:col-span-3":
                productMedia.length === 3,
              "col-span-5": productMedia.length === 2,
            })}
          >
            <ProductMediaItem singleMedia={m} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-20">
        <div className="space-y-6">
          <div className="flex justify-between gap-2">
            <span>Product name</span>
            <span>Product price</span>
          </div>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed at
            doloribus, iste ad itaque rem dicta laudantium iure nisi nulla
            deserunt, vel, vero quibusdam inventore cumque quis libero?
            Consequatur, in.
          </div>
          <div>
            <span className="underline">measurements</span>
          </div>
        </div>
        <AddToCartForm
          sizes={product?.sizes || []}
          id={product?.product?.id || 0}
        />
      </div>
    </NavigationLayout>
  );
}
