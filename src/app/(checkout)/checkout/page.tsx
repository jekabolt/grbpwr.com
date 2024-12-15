import LogoLayout from "@/components/logo-layout";
import { Text } from "@/components/ui/text";

import { BackButton } from "./_components/back-button";
import NewOrderForm from "./_components/new-order-form";

export default async function CheckoutPage() {
  return (
    <LogoLayout>
      <div className="flex gap-x-12">
        <BackButton className="absolute left-0 top-3 lg:relative lg:top-0" />
        <Text variant="uppercase">Checkout</Text>
      </div>
      <div className="lg:px-28">
        <NewOrderForm />
      </div>
    </LogoLayout>
  );
}
