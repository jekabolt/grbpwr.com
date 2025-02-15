import FlexibleLayout from "@/components/flexible-layout";

import NewOrderForm from "./_components/new-order-form";

export default async function CheckoutPage() {
  return (
    <>
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
        <div className="px-2.5 py-20 lg:px-44 lg:py-24">
          <NewOrderForm />
        </div>
      </FlexibleLayout>
    </>
  );
}
