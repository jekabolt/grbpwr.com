"use client";

import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";

type Props = {
  changeProductAmount: ({
    slug,
    size,
    operation,
  }: {
    slug: string;
    size: string;
    operation: "increase" | "decrease";
  }) => void;
  removeProduct: (slug: string, size: string) => void;
  slug: string;
  size: string;
};

export default function ProductAmountButtons({
  changeProductAmount,
  removeProduct,
  slug,
  size,
}: Props) {
  // todo: check if product is in stock

  return (
    <div className="flex flex-col">
      <div className="flex ">
        <Button
          style={ButtonStyle.default}
          onClick={() =>
            changeProductAmount({ slug, size, operation: "increase" })
          }
        >
          [+]
        </Button>
        <Button
          style={ButtonStyle.default}
          onClick={() =>
            changeProductAmount({ slug, size, operation: "decrease" })
          }
        >
          [-]
        </Button>
        <Button
          style={ButtonStyle.default}
          onClick={() => removeProduct(slug, size)}
        >
          [x]
        </Button>
      </div>
    </div>
  );
}
