import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";

import { serviceClient } from "@/lib/api";

import { QrCode } from "../../[uuid]/crypto/_components/qr-code";

export default async function Page(props: Props) {
  const params = await props.params;
  const { uuid } = params;

  const orderResponse = await serviceClient.GetOrderByUUID({ orderUuid: uuid });
  const order = orderResponse.order;

  if (
    order?.payment?.paymentInsert?.paymentMethod !==
    "PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA"
  ) {
    notFound();
  }

  const euroAmount =
    order?.payment?.paymentInsert?.transactionAmount?.value || "";
  const cryptoAmount =
    order?.payment?.paymentInsert?.transactionAmountPaymentCurrency?.value ||
    "";
  const payeeAddress = order?.payment?.paymentInsert?.payee || "";
  const qrBase64Code = await QRCode.toDataURL(payeeAddress);

  if (order?.payment?.paymentInsert?.isTransactionDone) {
    redirect(`/order/${uuid}`);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <QrCode
        euroAmount={euroAmount}
        cryptoAmount={cryptoAmount}
        orderId={uuid}
        payeeAddress={payeeAddress}
        qrBase64Code={qrBase64Code}
      />
    </div>
  );
}

interface Props {
  params: Promise<{
    uuid: string;
  }>;
}
