"use client";

import { useState } from "react";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LoadingButtonProps {
  children: React.ReactNode;
  isLoadingExternal?: boolean;
  className?: string;
  onAction: () => Promise<boolean>;
  [key: string]: unknown;
}

export function LoadingButton({
  onAction,
  className,
  children,
  isLoadingExternal = false,
  ...props
}: LoadingButtonProps) {
  const [isLoadingInternal, setIsLoadingInternal] = useState(false);
  const { openCart } = useCart((state) => state);

  const handleClick = async () => {
    setIsLoadingInternal(true);
    try {
      const success = await onAction();
      if (success) {
        openCart();
      }
    } finally {
      setIsLoadingInternal(false);
    }
  };

  const isLoading = isLoadingInternal || isLoadingExternal;

  return (
    <Button
      {...props}
      className={cn(
        "blackTheme flex w-full justify-between uppercase",
        {
          "justify-center": isLoading,
        },
        className,
      )}
      onClick={handleClick}
      loading={isLoading}
    >
      {children}
    </Button>
  );
}
