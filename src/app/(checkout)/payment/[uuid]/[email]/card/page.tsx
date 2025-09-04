import { notFound } from "next/navigation";

import { serviceClient } from "@/lib/api";
import { WhiteLogo } from "@/components/ui/icons/white-logo";

import { StripeForm } from "./_components/stripe-form";

export default async function Page(props: Props) {
  const params = await props.params;
  const { uuid, email } = params;
  const clientSecret = (await props.searchParams).clientSecret;

  if (!clientSecret) {
    notFound();
  }

  const orderResponse = await serviceClient.GetOrderByUUIDAndEmail({
    orderUuid: uuid,
    b64Email: email,
  });
  const order = orderResponse.order;
  const amount = order?.order?.totalPrice?.value || "0";
  const country = order?.billing?.addressInsert?.country;

  console.log(country);

  if (
    order?.payment?.paymentInsert?.paymentMethod !==
    "PAYMENT_METHOD_NAME_ENUM_CARD_TEST"
  ) {
    notFound();
  }

  return (
    <div className="px-2.5 py-10 lg:px-56 lg:pb-40 lg:pt-20">
      <div className="flex h-full flex-col gap-10 lg:flex-row">
        <div className="w-1/2 self-start">
          <WhiteLogo />
        </div>
        <div className="h-full w-full lg:w-1/2">
          <StripeForm
            clientSecret={clientSecret}
            uuid={uuid}
            email={email}
            amount={amount}
            country={country || ""}
          />
        </div>
      </div>
    </div>
  );
}

interface Props {
  params: Promise<{
    email: string;
    uuid: string;
  }>;
  searchParams: Promise<{
    clientSecret: string;
  }>;
}
