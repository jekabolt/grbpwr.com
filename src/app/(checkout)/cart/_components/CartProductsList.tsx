"use client";

// import { addCartProduct, clearCartProducts } from "@/lib/actions/cart";
import { use } from "react";

import { serviceClient } from "@/lib/api";
import { useCart } from "@/lib/stores/cart/store-provider";
import CartItemRow from "@/app/(checkout)/cart/_components/CartItemRow";

// import SelectedCurrency from "@/app/(checkout)/cart/_components/TotalPrice/SelectedCurrency";
// import { getValidateOrderItemsInsertItems } from "@/app/(checkout)/cart/_components/utils";

// wrapped in suspense. new technics should be used
// think how make it easy
export default function CartProductsList({
  className,
}: {
  className?: string;
}) {
  const products = useCart((state) => state.products);
  console.log(products);
  // const response = use(

  //   serviceClient.ValidateOrderItemsInsert({
  //     items: [],
  //     shipmentCarrierId: undefined,
  //     promoCode: undefined,
  //   }),
  // );

  // console.log("responseresponse");
  // console.log(response);

  // const items = await getValidateOrderItemsInsertItems();

  // if (items.length === 0) return null;

  // const response = await serviceClient.ValidateOrderItemsInsert({
  //   items,
  //   shipmentCarrierId: undefined,
  //   promoCode: undefined,
  // });

  // const updateCookieCart = async () => {
  //   "use server";

  //   if (response?.validItems && response?.validItems?.length > 0) {
  //     clearCartProducts();

  //     for (const p of response.validItems) {
  //       if (
  //         p.orderItem?.productId &&
  //         p.orderItem.quantity &&
  //         p.orderItem.sizeId
  //       ) {
  //         addCartProduct({
  //           id: p.orderItem.productId,
  //           size: p.orderItem.sizeId.toString(),
  //           quantity: p.orderItem.quantity,
  //         });
  //       }
  //     }
  //   }
  // };

  return (
    <div className={"space-y-6"}>
      {JSON.stringify(products)}
      {/* {response?.validItems?.map((p, i) => (
        <CartItemRow
          key={(p.id as number) + i}
          product={p}
          className={className}
        />
      ))} */}
      {/* <SelectedCurrency baseCurrencyTotal={Number(response.totalSale?.value)} /> */}
      {/* {response.hasChanged && ( */}
      {/* <HACK__UpdateCookieCart updateCookieCart={updateCookieCart} /> */}
      {/* )} */}
    </div>
  );
}
