import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import MeasurementsModalContent from "./MeasurementsModalContent";
import { common_ProductSize } from "@/api/proto-http/frontend";

interface Props {
  addCartProduct: ({ id, size }: { id: number; size: string }) => Promise<void>;
  productId: number | undefined;
  sizes: common_ProductSize[] | undefined;
}

export default function MeasurementsModal({
  addCartProduct,
  productId,
  sizes,
}: Props) {
  async function handleAddToCartClick(selectedSize: number | undefined) {
    "use server";

    if (productId && selectedSize) {
      await addCartProduct({
        id: productId,
        size: selectedSize.toString(),
      });
    }
  }

  return (
    <Modal
      openElement={
        <Button asChild variant="underline">
          measurements
        </Button>
      }
    >
      <MeasurementsModalContent
        sizes={sizes}
        handleAddToCartClick={handleAddToCartClick}
      />
    </Modal>
  );
}
