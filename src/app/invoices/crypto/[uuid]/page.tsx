import CoreLayout from "@/components/layouts/CoreLayout";
import { serviceClient } from "@/lib/api";

import V0GenUi from "./V0GenUi";

interface Props {
  params: {
    uuid: string;
  };
}

export default async function Page({ params }: Props) {
  const { uuid } = params;

  const cryptoPaymentInvoice = await serviceClient.CheckCryptoPayment({
    orderUuid: uuid,
  });

  return (
    <CoreLayout>
      <V0GenUi
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
