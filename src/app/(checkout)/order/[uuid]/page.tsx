import { Suspense } from "react";
import Link from "next/link";

import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { OrderPageComponent } from "./_components/order-page";
import { OrderPageSkeleton } from "./_components/order-page-skeleton";

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
    <div className="flex min-h-screen flex-col justify-between gap-40 px-16 pb-10 pt-20">
      <div>
        <Text variant="uppercase" component="h1">
          Order info
        </Text>

        <Suspense fallback={<OrderPageSkeleton />}>
          <OrderPageComponent orderPromise={orderPromise} />
        </Suspense>
      </div>
      <div>
        {/* // add button style based on text */}
        <Button variant="default" size="sm" asChild>
          <Link href="/">
            <Text component="span" size="small" variant="inactive">
              contact support
            </Text>
          </Link>
        </Button>
      </div>
    </div>
  );
}
