"use client";

import { useEffect } from "react";

export default function HACK__UpdateCookieCart({
  updateCookieCart,
}: {
  updateCookieCart: () => Promise<void>;
}) {
  useEffect(() => {
    updateCookieCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}