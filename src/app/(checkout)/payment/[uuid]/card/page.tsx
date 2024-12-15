import { notFound } from "next/navigation";

import { serviceClient } from "@/lib/api";

import { StripeForm } from "./_components/stripe-form";

export default async function Page(props: Props) {
  const uuid = (await props.params).uuid;
  const clientSecret = (await props.searchParams).clientSecret;

  if (!clientSecret) {
    notFound();
  }

  const orderResponse = await serviceClient.GetOrderByUUID({ orderUuid: uuid });
  const order = orderResponse.order;

  if (
    order?.payment?.paymentInsert?.paymentMethod !==
    "PAYMENT_METHOD_NAME_ENUM_CARD_TEST"
  ) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <StripeForm clientSecret={clientSecret} uuid={uuid} />
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
