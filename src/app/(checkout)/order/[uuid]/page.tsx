import { Suspense } from "react";

import { serviceClient } from "@/lib/api";

import { OrderPageComponent } from "./_components/order-page";

interface Props {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function OrderPage(props: Props) {
  const params = await props.params;
  const { uuid } = params;

  const orderPromise = serviceClient.GetOrderByUUID({ orderUuid: uuid });

  // const isCryptoPayment =
  //   response.order?.payment?.paymentInsert?.paymentMethod ===
  //   "PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA";
  // const isTransactionDone =
  //   response.order?.payment?.paymentInsert?.isTransactionDone;

  // if (isCryptoPayment && !isTransactionDone) {
  //   const qrBase64Code = await QRCode.toDataURL(
  //     response.order?.payment?.paymentInsert?.payee || "",
  //   );

  //   return (
  //     <div>
  //       <V0GenUiQRCode
  //         qrBase64Code={qrBase64Code}
  //         euroAmount={
  //           response.order?.payment?.paymentInsert?.transactionAmount?.value ||
  //           ""
  //         }
  //         cryptoAmount={
  //           response.order?.payment?.paymentInsert
  //             ?.transactionAmountPaymentCurrency?.value || ""
  //         }
  //         orderId={uuid}
  //         payeeAddress={response.order?.payment?.paymentInsert?.payee || ""}
  //       />
  //     </div>
  //   );
  // }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderPageComponent orderPromise={orderPromise} />
    </Suspense>
  );
}
