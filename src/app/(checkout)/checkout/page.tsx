import LogoLayout from "@/components/logo-layout";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import NewOrderForm from "./_components/new-order-form";

export default async function CheckoutPage() {
  return (
    <LogoLayout>
      <div className="flex gap-x-12">
        <Button variant="underlineWithColors" className="w-16">
          {"<"} back
        </Button>
        <Text variant="uppercase">Checkout</Text>
      </div>
      <div className="px-28">
        <NewOrderForm />
      </div>
    </LogoLayout>
  );
}
