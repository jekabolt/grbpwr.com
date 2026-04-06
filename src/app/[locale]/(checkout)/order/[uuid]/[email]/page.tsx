import { notFound } from "next/navigation";

import { ORDER_STATUS_DELIVERED_ID } from "@/constants";

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

  const orderResponse = await serviceClient
    .GetOrderByUUIDAndEmail({
      orderUuid: uuid,
      b64Email: email,
    })
    .catch(() => {
      notFound();
    });

  if (!orderResponse.order) {
    notFound();
  }

  const orderPromise = Promise.resolve(orderResponse);
  const isDelivered =
    orderResponse.order?.order?.orderStatusId === ORDER_STATUS_DELIVERED_ID;

  return (
    <FlexibleLayout>
      <div className="flex min-h-[calc(100dvh-10rem)] flex-col gap-10 px-2.5 pb-20 pt-24 lg:min-h-[calc(100dvh-12rem)] lg:px-32 lg:py-24">
        <div className="flex min-h-0 flex-1 flex-col">
          <OrderExperienceClient
            isDelivered={isDelivered}
            orderPromise={orderPromise}
            orderUuid={uuid}
            b64Email={email}
          />
        </div>
      </div>
    </FlexibleLayout>
  );
}
