import { Suspense } from "react";
import Link from "next/link";

import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-screen flex-col justify-between gap-40 px-2 pb-10 pt-10 lg:px-16 lg:pt-20">
      <div>
        <Text variant="uppercase" component="h1">
          Order info
        </Text>

        <Suspense fallback={<OrderPageSkeleton />}>
          <OrderPageComponent orderPromise={orderPromise} />
        </Suspense>
      </div>
      <div>
        {/* // add button style based on text */}
        <Button variant="default" size="sm" asChild>
          <Link href="/">
            <Text component="span" size="small" variant="inactive">
              contact support
            </Text>
          </Link>
        </Button>
      </div>
    </div>
  );
}
