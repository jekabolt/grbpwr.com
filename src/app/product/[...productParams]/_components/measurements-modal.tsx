import {
  common_GenderEnum,
  common_ProductSize,
} from "@/api/proto-http/frontend";

import Modal from "@/components/ui/modal";

import MeasurementsModalContent from "./measurements-modal-content";

interface Props {
  // addCartProduct: ({ id, size }: { id: number; size: string }) => Promise<void>;
  productId: number | undefined;
  sizes: common_ProductSize[] | undefined;
  categoryId: number | undefined;
  gender: common_GenderEnum | undefined;
}

export default function MeasurementsModal({
  // addCartProduct,
  productId,
  sizes,
  categoryId,
  gender,
}: Props) {
  // async function handleAddToCartClick(selectedSize: number | undefined) {
  //   "use server";

  //   if (productId && selectedSize) {
  //     await addCartProduct({
  //       id: productId,
  //       size: selectedSize.toString(),
  //     });
  //   }
  // }

  return (
    <Modal openElement="size guide">
      <MeasurementsModalContent
        id={productId}
        sizes={sizes}
        // handleAddToCartClick={handleAddToCartClick}
        categoryId={categoryId}
        gender={gender}
      />
    </Modal>
  );
}
function addCartProduct(arg0: { id: number; size: string }) {
  throw new Error("Function not implemented.");
}
