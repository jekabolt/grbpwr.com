import { addCartProduct } from "@/features/cart/action";
import AddToCartForm from "@/components/forms/AddToCartForm";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import { FullscreenImagesCarousel } from "@/features/images-carousel";
import { ProductMediaItem } from "@/features/images-carousel/ProductMediaItem";
import MeasurementsModal from "@/features/measurements-modal";
import { CURRENCY_MAP, MAX_LIMIT } from "@/constants";
import { serviceClient } from "@/lib/api";
import { notFound } from "next/navigation";

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

  return (
    <NavigationLayout>
      <div className="relative flex flex-col bg-white pb-20 pt-5">
        {product?.media && (
          <div className="grid w-full grid-cols-6 items-end gap-2">
            <FullscreenImagesCarousel
              mediaList={product.media}
              ItemComponent={ProductMediaItem}
            />
          </div>
        )}
        <div className="flex w-1/2 flex-col">
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
          <div className="mt-4">
            <MeasurementsModal
              addCartProduct={addCartProduct}
              sizes={product?.sizes}
              productId={product?.product?.id}
            />
          </div>

          {product?.product?.id && product?.sizes?.length && (
            <AddToCartForm
              handleSubmit={addCartProduct}
              id={product.product.id}
              sizes={product.sizes}
            />
          )}
        </div>
      </div>
    </NavigationLayout>
  );
}
