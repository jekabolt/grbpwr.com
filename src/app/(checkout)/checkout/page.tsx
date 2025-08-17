import FlexibleLayout from "@/components/flexible-layout";

import NewOrderForm from "./_components/new-order-form";

export default async function CheckoutPage() {
  return (
    <FlexibleLayout
      headerType="flexible"
      displayFooter={false}
      headerProps={{
        left: "<",
        center: "checkout",
        right: "close",
      }}
    >
      <div className="px-2.5 py-20 lg:relative lg:min-h-screen lg:px-32 lg:py-24">
        <NewOrderForm />
      </div>
    </FlexibleLayout>
  );
}
