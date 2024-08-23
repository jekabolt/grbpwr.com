"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function HACK__UpdateCookieCart({
  updateCookieCart,
}: {
  updateCookieCart: () => Promise<void>;
}) {
  useEffect(() => {
    updateCookieCart();

    toast.info("Cart items have been updated!");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
