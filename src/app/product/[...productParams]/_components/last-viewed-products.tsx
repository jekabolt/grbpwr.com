"use client";

import { useEffect } from "react";
import { common_Product } from "@/api/proto-http/frontend";

import { useLastViewed } from "@/lib/stores/last-viewed/store-provider.";
import { ProductItem } from "@/app/_components/product-item";
import { Text } from "@/components/ui/text";

interface LastViewedProductsProps {
  product: common_Product;
}

export function LastViewedProducts({ product }: LastViewedProductsProps) {
  const addLastViewedProduct = useLastViewed((state) => state.addProduct);
  const lastViewedProducts = useLastViewed((state) => state.products);

  useEffect(() => {
    return () => {
      if (product) {
        addLastViewedProduct(product);
      }
    }
  }, [product, addLastViewedProduct]);

  const filteredProducts = lastViewedProducts
    .filter((viewedProduct) => viewedProduct.id !== product.id)
    .slice(0, 4);

  return (
    <div>
      <Text component="h2" variant="uppercase">recently viewed</Text>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-16 2xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <div key={product.id}>
            <ProductItem className="mx-auto" product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
