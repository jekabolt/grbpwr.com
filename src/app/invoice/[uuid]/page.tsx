import CoreLayout from "@/components/layouts/CoreLayout";
import { serviceClient } from "@/lib/api";
import QRCode from "qrcode";

import { redirect } from "next/navigation";
import V0GenUi from "./V0GenUi";

interface Props {
  params: {
    uuid: string;
  };
}

export default async function Page({ params }: Props) {
  const { uuid } = params;

  const cryptoPaymentInvoice = await serviceClient.CheckPayment({
    orderUuid: uuid,
  });

  if (!cryptoPaymentInvoice?.payment) redirect("/invoice");

  const qrBase64Code = cryptoPaymentInvoice?.payment?.paymentInsert?.payee
    ? await QRCode.toDataURL(cryptoPaymentInvoice.payment.paymentInsert.payee)
    : undefined;

  return (
    <CoreLayout>
      <V0GenUi
        qrBase64Code={qrBase64Code}
        euroAmount={
          cryptoPaymentInvoice.payment?.paymentInsert?.transactionAmount
            ?.value || ""
        }
        cryptoAmount={
          cryptoPaymentInvoice.payment?.paymentInsert
            ?.transactionAmountPaymentCurrency?.value || ""
        }
        orderId={uuid}
        payeeAddress={cryptoPaymentInvoice.payment?.paymentInsert?.payee || ""}
      />
    </CoreLayout>
  );
}
