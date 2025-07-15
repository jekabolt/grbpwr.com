import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";
import FieldsGroupContainer from "@/app/(checkout)/checkout/_components/new-order-form/fields-group-container";

import OrderStatusForm from "../_components/order-status-form";

export default function OrderStatus() {
  return (
    <FlexibleLayout footerType="mini">
      <div className="h-full space-y-12 px-2.5 pt-8 lg:space-y-16 lg:px-28 lg:pt-24">
        <div className="space-y-9">
          <Text variant="uppercase">order status</Text>
          <Text>
            you will find your order number in your order confirmation email. if
            you recently made a purchase, be aware that it could take a few
            minutes to process your order and receive the confirmation email. if
            you do not find you confirmation email, please check your spam
            folder.
          </Text>
        </div>
        <FieldsGroupContainer
          stage="1/1"
          title="check your order status"
          mode="non-collapsible"
        >
          <OrderStatusForm />
        </FieldsGroupContainer>
      </div>
    </FlexibleLayout>
  );
}
