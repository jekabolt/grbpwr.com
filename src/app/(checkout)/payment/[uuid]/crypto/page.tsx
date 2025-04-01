import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";

import { serviceClient } from "@/lib/api";

import { QrCode } from "../../[uuid]/crypto/_components/qr-code";

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
    notFound();
    // add error handling
  }

  console.log("orderResponse", orderResponse.order?.order?.orderStatusId);
  const paymentInsert = orderResponse.order?.payment?.paymentInsert;

  if (paymentInsert?.paymentMethod !== "PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA") {
    notFound();
  }

  // const euroAmount =
  //   order?.payment?.paymentInsert?.transactionAmount?.value || "";
  // const cryptoAmount =
  //   order?.payment?.paymentInsert?.transactionAmountPaymentCurrency?.value ||
  //   "";
  const payeeAddress = paymentInsert?.payee || "";
  const qrBase64Code = await QRCode.toDataURL(payeeAddress);

  if (paymentInsert?.isTransactionDone) {
    redirect(`/order/${uuid}`);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <QrCode
        paymentInsert={paymentInsert}
        qrBase64Code={qrBase64Code}
        orderUuid={orderResponse.order?.order?.uuid}
        orderStatusId={orderResponse.order?.order?.orderStatusId}
      />
    </div>
  );
}
