"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { common_Colorway } from "@/api/proto-http/frontend";
import { useInView } from "react-intersection-observer";

import { useLastViewed } from "@/lib/stores/last-viewed/store-provider.";

// The "recently viewed" grid sits below the fold, so load it (and the ProductItem
// cards it renders) only when scrolled near. The view-tracking side effect stays
// in this always-mounted wrapper so it still records the current product on
// navigation away, regardless of whether the user scrolled to the section.
const LastViewedList = dynamic(
  () => import("./last-viewed-list").then((m) => m.LastViewedList),
  { ssr: false },
);

interface LastViewedProductsProps {
  product: common_Colorway;
}

export function LastViewedProducts({ product }: LastViewedProductsProps) {
  const addProduct = useLastViewed((state) => state.addProduct);

  useEffect(() => {
    return () => {
      if (product) {
        addProduct(product);
      }
    };
  }, [product, addProduct]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "400px 0px",
  });

  return (
    <div ref={ref}>
      {inView && <LastViewedList currentProductId={product.id} />}
    </div>
  );
}
