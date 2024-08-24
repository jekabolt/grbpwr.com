"use client";

import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";

type Props = {
  changeProductAmount: ({
    id,
    size,
    operation,
  }: {
    id: number;
    size: string;
    operation: "increase" | "decrease";
  }) => void;
  removeProduct: ({ id, size }: { id: number; size: string }) => void;
  id: number;
  size: string;
};

export default function ProductAmountButtons({
  changeProductAmount,
  removeProduct,
  id,
  size,
}: Props) {
  // todo: check if product is in stock

  return (
    <div className="flex flex-col">
      <div className="flex ">
        <Button
          style={ButtonStyle.default}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            changeProductAmount({ id, size, operation: "increase" });
          }}
        >
          [+]
        </Button>
        <Button
          style={ButtonStyle.default}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            changeProductAmount({ id, size, operation: "decrease" });
          }}
        >
          [-]
        </Button>
        <Button
          style={ButtonStyle.default}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            removeProduct({ id, size });
          }}
        >
          [x]
        </Button>
      </div>
    </div>
  );
}
