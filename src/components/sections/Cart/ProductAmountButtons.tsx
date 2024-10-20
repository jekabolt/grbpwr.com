"use client";

import { Button } from "@/components/ui/Button";

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
  id: number;
  size: string;
  children: React.ReactNode;
};

export default function ProductAmountButtons({
  id,
  size,
  children,
  changeProductAmount,
}: Props) {
  return (
    <div className="flex gap-1">
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          changeProductAmount({ id, size, operation: "increase" });
        }}
      >
        +
      </Button>
      {children}
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          changeProductAmount({ id, size, operation: "decrease" });
        }}
      >
        -
      </Button>
    </div>
  );
}
