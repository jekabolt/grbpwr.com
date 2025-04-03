import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";

import { CryptoPayment } from "./_components/crypto-payment";

interface Props {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { uuid } = params;

  let orderResponse;

  try {
    orderResponse = await serviceClient.GetOrderByUUID({ orderUuid: uuid });
  } catch (error) {
    console.error("Error fetching order:", error);
  }

  const paymentInsert = orderResponse?.order?.payment?.paymentInsert;

  if (paymentInsert?.paymentMethod !== "PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA") {
    notFound();
  }

  const payeeAddress = paymentInsert?.payee || "";
  const qrBase64Code = await QRCode.toDataURL(payeeAddress);

  if (paymentInsert?.isTransactionDone) {
    redirect(`/order/${uuid}`);
  }

  return (
    <FlexibleLayout
      headerType="flexible"
      headerProps={{ left: "< back", link: "checkout", hidden: true }}
    >
      <div className="flex h-screen w-full items-start justify-center">
        <CryptoPayment
          paymentInsert={paymentInsert}
          qrBase64Code={qrBase64Code}
          orderUuid={orderResponse?.order?.order?.uuid}
          orderStatusId={orderResponse?.order?.order?.orderStatusId}
        />
      </div>
    </FlexibleLayout>
  );
}
