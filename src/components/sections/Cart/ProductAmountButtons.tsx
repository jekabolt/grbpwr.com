"use client";

import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";

type Props = {
  changeProductAmount: ({
    slug,
    size,
    operation,
    price,
  }: {
    slug: string;
    size: string;
    price: number;
    operation: "increase" | "decrease";
  }) => void;
  removeProduct: ({
    productSlug,
    size,
  }: {
    productSlug: string;
    size: string;
  }) => void;
  slug: string;
  size: string;
  price: number;
};

export default function ProductAmountButtons({
  changeProductAmount,
  removeProduct,
  slug,
  size,
  price,
}: Props) {
  // todo: check if product is in stock

  return (
    <div className="flex flex-col">
      <div className="flex ">
        <Button
          style={ButtonStyle.default}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            changeProductAmount({ slug, size, operation: "increase", price });
          }}
        >
          [+]
        </Button>
        <Button
          style={ButtonStyle.default}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            changeProductAmount({ slug, size, operation: "decrease", price });
          }}
        >
          [-]
        </Button>
        <Button
          style={ButtonStyle.default}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            removeProduct({ productSlug: slug, size });
          }}
        >
          [x]
        </Button>
      </div>
    </div>
  );
}
