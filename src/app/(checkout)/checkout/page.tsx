import { redirect } from "next/navigation";
import {
  common_OrderItem,
  common_OrderItemInsert,
  common_OrderNew,
} from "@/api/proto-http/frontend";

// import { addCartProduct, clearCartProducts } from "@/lib/actions/cart";
import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import NavigationLayout from "@/app/_components/navigation-layout";

import NewOrderForm from "./_components/new-order-form";

export default async function CheckoutPage() {
  return (
    <NavigationLayout>
      <NewOrderForm />
    </NavigationLayout>
  );
}
