"use client";

import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";

type Props = {
  removeItemFromCookie: (slug: string, size?: string) => Promise<void>;
  slug: string;
  size?: string;
};

export default function RemoveFromCart({
  removeItemFromCookie,
  slug,
  size,
}: Props) {
  async function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    await removeItemFromCookie(slug, size);
  }

  // todo: check if product is in stock

  return (
    <Button style={ButtonStyle.default} onClick={handleButtonClick}>
      [x]
    </Button>
  );
}
