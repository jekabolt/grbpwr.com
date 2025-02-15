"use client";

import { useEffect } from "react";
import { common_Product } from "@/api/proto-http/frontend";

import { useLastViewed } from "@/lib/stores/last-viewed/store-provider.";
import { ProductItem } from "@/app/_components/product-item";

interface LastViewedProductsProps {
  product: common_Product;
}

const LastViewedProducts: React.FC<LastViewedProductsProps> = ({ product }) => {
  const addLastViewedProduct = useLastViewed((state) => state.addProduct);
  const lastViewedProducts = useLastViewed((state) => state.products);

  useEffect(() => {
    if (product) {
      addLastViewedProduct(product);
    }
  }, [product, addLastViewedProduct]);

  const filteredProducts = lastViewedProducts
    .filter((viewedProduct) => viewedProduct.id !== product.id)
    .slice(0, 4);

  return (
    <div>
      <h2>RECENTLY VIEWED</h2>
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

export default LastViewedProducts;
