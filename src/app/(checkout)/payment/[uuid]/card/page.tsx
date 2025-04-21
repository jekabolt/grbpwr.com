import { notFound } from "next/navigation";

import { serviceClient } from "@/lib/api";
import { Logo } from "@/components/ui/icons/logo";

import { StripeForm } from "./_components/stripe-form";

export default async function Page(props: Props) {
  const uuid = (await props.params).uuid;
  const clientSecret = (await props.searchParams).clientSecret;

  if (!clientSecret) {
    notFound();
  }

  const orderResponse = await serviceClient.GetOrderByUUID({ orderUuid: uuid });
  const order = orderResponse.order;
  const amount = order?.order?.totalPrice?.value || "0";

  if (
    order?.payment?.paymentInsert?.paymentMethod !==
    "PAYMENT_METHOD_NAME_ENUM_CARD_TEST"
  ) {
    notFound();
  }

  return (
    <div className="h-screen p-40">
      <div className="flex h-full items-start justify-center gap-10">
        <div className="w-1/2 bg-textColor">
          <Logo />
        </div>
        <div className="h-full w-1/2">
          <StripeForm clientSecret={clientSecret} uuid={uuid} amount={amount} />
        </div>
      </div>
    </div>
  );
}

interface Props {
  params: Promise<{
    uuid: string;
  }>;
  searchParams: Promise<{
    clientSecret: string;
  }>;
}
