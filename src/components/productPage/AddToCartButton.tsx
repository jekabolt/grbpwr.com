"use client";

import Button from "@/components/ui/Button";
import { LinkStyle } from "@/components/ui/Button/styles";

type Props = {
  addItemToCookie: (slug: string) => Promise<void>;
  slug: string;
};

export default function AddToCartButton({ addItemToCookie, slug }: Props) {
  async function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    await addItemToCookie(slug);
  }

  // todo: check if product is in stock

  return (
    <Button style={LinkStyle.simpleButton} onClick={handleButtonClick}>
      add to cart
    </Button>
  );
}
