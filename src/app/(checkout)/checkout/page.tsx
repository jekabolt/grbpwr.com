import { CheckoutStoreProvider } from "@/lib/stores/checkout/store-provider";
import FlexibleLayout from "@/components/flexible-layout";

import NewOrderForm from "./_components/new-order-form";

export default async function CheckoutPage() {
  return (
    <FlexibleLayout
      headerType="flexible"
      footerType="mini"
      headerProps={{
        left: "< cart",
        center: "checkout",
        right: "close",
        link: "cart",
      }}
    >
      <CheckoutStoreProvider>
        <div className="px-2.5 py-20 lg:px-32 lg:py-32">
          <NewOrderForm />
        </div>
      </CheckoutStoreProvider>
    </FlexibleLayout>
  );
}
