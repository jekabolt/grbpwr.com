import { Suspense } from "react";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import { OrderPageComponent } from "./_components/order-page";
import { OrderPageSkeleton } from "./_components/order-page-skeleton";

interface Props {
  params: Promise<{
    uuid: string;
    email: string;
  }>;
}

export default async function OrderPage(props: Props) {
  const params = await props.params;
  const { uuid, email } = params;

  const orderPromise = serviceClient.GetOrderByUUIDAndEmail({
    orderUuid: uuid,
    b64Email: email,
  });

  return (
    <FlexibleLayout footerType="mini">
      <div className="space-y-10 px-2.5 pb-20 pt-10 lg:px-32 lg:pt-24">
        <Text variant="uppercase" component="h1">
          Order info
        </Text>
        <Suspense fallback={<OrderPageSkeleton />}>
          <OrderPageComponent orderPromise={orderPromise} />
        </Suspense>
      </div>
    </FlexibleLayout>
  );
}
