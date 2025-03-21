"use client";

import { useEffect, useRef } from "react";
import { common_Product } from "@/api/proto-http/frontend";

import { useLastViewed } from "@/lib/stores/last-viewed/store-provider.";
import { Text } from "@/components/ui/text";
import { ProductItem } from "@/app/_components/product-item";

interface LastViewedProductsProps {
  product: common_Product;
}

export function LastViewedProducts({ product }: LastViewedProductsProps) {
  const addLastViewedProduct = useLastViewed((state) => state.addProduct);
  const lastViewedProducts = useLastViewed((state) => state.products);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (product) {
        addLastViewedProduct(product);
      }
    };
  }, [product, addLastViewedProduct]);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile && scrollContainerRef.current && firstItemRef.current) {
      const visibilityFactor = 0.2;

      const itemWidth = firstItemRef.current.offsetWidth;
      const scrollPosition = itemWidth * visibilityFactor;

      scrollContainerRef.current.scrollLeft = scrollPosition;
    }
  }, [lastViewedProducts]);

  const filteredProducts = lastViewedProducts
    .filter((viewedProduct) => viewedProduct.id !== product.id)
    .slice(0, 4);

  return (
    <div className="space-y-16 pb-16 lg:space-y-12 lg:px-2.5 lg:pb-28">
      <Text variant="uppercase" className="px-2.5 lg:px-0">
        recently viewed
      </Text>

      <div
        ref={scrollContainerRef}
        className="flex items-start gap-2 overflow-x-scroll lg:gap-7"
      >
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="w-full"
            ref={index === 0 ? firstItemRef : undefined}
          >
            <ProductItem className="w-40 lg:w-full" product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
