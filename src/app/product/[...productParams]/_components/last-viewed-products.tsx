"use client";

import { useEffect } from "react";
import { common_Product } from "@/api/proto-http/frontend";

import { useLastViewed } from "@/lib/stores/last-viewed/store-provider.";
import { cn } from "@/lib/utils";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";
import { ProductItem } from "@/app/_components/product-item";

interface LastViewedProductsProps {
  product: common_Product;
}

export function LastViewedProducts({ product }: LastViewedProductsProps) {
  const { products, addProduct } = useLastViewed((state) => state);

  const filteredProducts = products
    .filter((viewedProduct) => viewedProduct.id !== product.id)
    .slice(0, 4);

  useEffect(() => {
    return () => {
      if (product) {
        addProduct(product);
      }
    };
  }, [product, addProduct]);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-16 pb-16 lg:space-y-12 lg:px-2.5 lg:pb-28">
      <Text variant="uppercase" className="px-2.5 lg:px-0">
        recently viewed
      </Text>

      <div className="flex justify-center gap-2 lg:gap-7">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className={cn("lg:w-50 group relative w-52", {
              "hidden lg:block": index === 3,
            })}
          >
            <ProductItem
              className="w-full"
              product={product}
              isInfoVisible={false}
            />
            <Overlay
              cover="container"
              color="light"
              className="opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
