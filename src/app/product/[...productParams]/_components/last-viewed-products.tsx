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
    <div className="space-y-16 px-2.5 pb-16 pt-6 lg:space-y-12 lg:py-32">
      <Text variant="uppercase">recently viewed</Text>

      <div className="flex justify-center gap-2 lg:gap-7">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className={cn("group relative w-32 lg:w-52", {
              "hidden lg:block": index === 3,
            })}
          >
            <ProductItem
              className="w-full"
              product={product}
              isInfoVisible={false}
            />
            <div className="pointer-events-none opacity-0 transition-opacity group-hover:opacity-100">
              <Overlay cover="container" color="light" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
