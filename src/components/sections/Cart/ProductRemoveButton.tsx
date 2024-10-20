"use client";

import { Button } from "@/components/ui/Button";

type Props = {
  removeProduct: ({ id, size }: { id: number; size: string }) => void;
  id: number;
  size: string;
};

export default function ProductRemoveButton({
  id,
  size,
  removeProduct,
}: Props) {
  return (
    <Button
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        removeProduct({ id, size });
      }}
      variant="underline"
    >
      remove
    </Button>
  );
}
