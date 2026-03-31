import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";

import { OrderExperienceClient } from "./_components/order-experience-client";

interface PageProps {
  params: Promise<{
    uuid: string;
    email: string;
  }>;
}

export default async function OrderPage(props: PageProps) {
  const params = await props.params;
  const { uuid, email } = params;

  const orderResponse = await serviceClient.GetOrderByUUIDAndEmail({
    orderUuid: uuid,
    b64Email: email,
  });
  const orderPromise = Promise.resolve(orderResponse);
  const isDelivered = orderResponse.order?.order?.orderStatusId === 5;

  return (
    <FlexibleLayout>
      <div className="space-y-10 px-2.5 pb-20 pt-24 lg:px-32 lg:py-24">
        <OrderExperienceClient
          isDelivered={isDelivered}
          orderPromise={orderPromise}
          orderUuid={uuid}
          b64Email={email}
        />
      </div>
    </FlexibleLayout>
  );
}
