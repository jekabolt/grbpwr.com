"use client";

import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";

type Props = {
  decreaseItemAmount: (slug: string, size?: string) => Promise<void>;
  increaseItemAmount: (slug: string, size?: string) => Promise<void>;
  quantity: number;
  slug: string;
  size?: string;
};

export default function RemoveFromCart({
  decreaseItemAmount,
  increaseItemAmount,
  quantity,
  slug,
  size,
}: Props) {
  async function handleIncreaseButtonClick(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    await increaseItemAmount(slug, size);
  }

  async function handleDecreaseButtonClick(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    await decreaseItemAmount(slug, size);
  }

  // todo: check if product is in stock

  return (
    <div className="flex flex-col">
      <div>amount: {quantity}</div>
      <div className="flex ">
        <Button style={ButtonStyle.default} onClick={handleDecreaseButtonClick}>
          [-]
        </Button>
        <Button style={ButtonStyle.default} onClick={handleIncreaseButtonClick}>
          [+]
        </Button>
      </div>
    </div>
  );
}
