import { serviceClient } from "@/lib/api";
import QRCode from "qrcode";

import V0GenUiOrder from "./V0GenUi";
import V0GenUiQRCode from "./V0GenUiQRCode";

interface Props {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function OrderPage(props: Props) {
  const params = await props.params;
  const { uuid } = params;

  const response = await serviceClient.GetOrderByUUID({ orderUuid: uuid });

  const isCryptoPayment =
    response.order?.payment?.paymentInsert?.paymentMethod ===
    "PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA";
  const isTransactionDone =
    response.order?.payment?.paymentInsert?.isTransactionDone;

  if (isCryptoPayment && !isTransactionDone) {
    const qrBase64Code = await QRCode.toDataURL(
      response.order?.payment?.paymentInsert?.payee || "",
    );

    return (
      <div>
        <V0GenUiQRCode
          qrBase64Code={qrBase64Code}
          euroAmount={
            response.order?.payment?.paymentInsert?.transactionAmount?.value ||
            ""
          }
          cryptoAmount={
            response.order?.payment?.paymentInsert
              ?.transactionAmountPaymentCurrency?.value || ""
          }
          orderId={uuid}
          payeeAddress={response.order?.payment?.paymentInsert?.payee || ""}
        />
      </div>
    );
  }

  return (
    <div>
      <V0GenUiOrder orderData={response.order as any} />
    </div>
  );
}
