import { addCartProduct } from "@/actions/cart";
import AddToCartForm from "@/components/forms/AddToCartForm";
import { MediaProvider } from "@/components/global/MediaProvider";
import { ProductMediaItem } from "@/components/global/MediaProvider/ProductMediaItem";
import Modal from "@/components/ui/Modal";
import CoreLayout from "@/components/layouts/CoreLayout";
import MeasurementsModalContent from "@/components/product/MeasurementsModalContent";
import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";
import { CURRENCY_MAP, MAX_LIMIT } from "@/constants";
import { serviceClient } from "@/lib/api";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: {
    productParams: string[];
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
      slug: product.slug?.replace("product/", "").split("/") || [],
    })) || []
  );
}

const catalogData = [
  { label: "cloth", separator: "/" },
  { label: "Jackets & Coats", separator: "/" },
];

export default async function ProductPage({ params }: ProductPageProps) {
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
          <div className="mt-4">
            <Modal
              openElement={
                <Button asChild style={ButtonStyle.underlinedButton}>
                  measurements
                </Button>
              }
            >
              <MeasurementsModalContent />
            </Modal>
          </div>

          {baseCurrencyPrice &&
            product?.product?.slug &&
            product?.sizes?.length && (
              <AddToCartForm
                handleSubmit={addCartProduct}
                slug={product.product.slug}
                price={parseInt(baseCurrencyPrice)}
                sizes={product.sizes}
              />
            )}
        </div>
      </div>
    </CoreLayout>
  );
}
