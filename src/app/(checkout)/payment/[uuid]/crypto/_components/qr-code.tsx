/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aw1UvxUdWmN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { common_PaymentInsert } from "@/api/proto-http/frontend";
import { useCopyToClipboard } from "@uidotdev/usehooks";

import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";

interface Props {
  paymentInsert?: common_PaymentInsert;
  qrBase64Code?: string;
  orderUuid?: string;
  orderStatusId?: number;
}

enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export function QrCode({
  paymentInsert,
  qrBase64Code,
  orderUuid,
  orderStatusId,
}: Props) {
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.PENDING,
  );
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);
  const [timeLeft, setTimeLeft] = useState("");

  const checkPaymentStatus = async () => {
    try {
      const response = await serviceClient.GetOrderInvoice({
        orderUuid: orderUuid?.toString() || "",
        paymentMethod: paymentInsert?.paymentMethod,
      });
      response.payment?.isTransactionDone &&
        setTransactionStatus(TransactionStatus.SUCCESS);
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  const cancelPayment = async () => {
    try {
      const response = await serviceClient.CancelOrderInvoice({
        orderUuid: orderUuid?.toString() || "",
      });
      response && setTransactionStatus(TransactionStatus.CANCELLED);
      // if success set transaction status to cancelled - in use effect below it will redirect to cart
    } catch (error) {
      console.error("Error cancelling payment:", error);
    }
  };

  useEffect(() => {
    if (!paymentInsert?.expiredAt) return;

    const calculateTimeLeft = () => {
      const expirationDate = new Date(paymentInsert?.expiredAt ?? "");
      const now = new Date();
      const difference = expirationDate.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      } else {
        setTimeLeft("00:00:00");
        setTransactionStatus(TransactionStatus.EXPIRED);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [paymentInsert?.expiredAt]);

  useEffect(() => {
    switch (orderStatusId) {
      case 2:
        setTransactionStatus(TransactionStatus.PENDING);
        break;
      case 3:
        setTransactionStatus(TransactionStatus.SUCCESS);
        break;
      case 6:
        setTransactionStatus(TransactionStatus.CANCELLED);
        break;
    }
  }, [orderStatusId]);

  useEffect(() => {
    if (transactionStatus === TransactionStatus.CANCELLED) {
      redirect("/checkout");
    }
  }, [transactionStatus]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* MAP TO CURRENCY  */}
      <div>CURRENCY USDT</div>
      <div>{paymentInsert?.transactionAmountPaymentCurrency?.value} USDT </div>
      <div className="flex flex-col items-center justify-center">
        <div>({paymentInsert?.transactionAmount?.value} €)</div>
        <div>*you pay network fee</div>
      </div>
      <div className="flex justify-between">
        <div>network</div>
        <div>TRON (TRC-20)</div>
      </div>
      <div className="flex justify-between">
        <div>expiration time</div>
        <div
          className={
            parseInt(timeLeft.split(":")[0]) === 0 &&
            parseInt(timeLeft.split(":")[1]) < 10
              ? "text-red-600"
              : ""
          }
        >
          {timeLeft}
        </div>
      </div>
      <div className="flex">
        {/* there is order id as well, so can be replaced instead of uuid */}
        <div>order reference : {orderUuid}</div>
        <div>
          <button>copy</button>
        </div>
      </div>
      <div className="h-56 w-56">
        {qrBase64Code && (
          <Image
            aspectRatio="1/1"
            src={qrBase64Code}
            fit="contain"
            alt="payment qr code"
          />
        )}
      </div>
      <div>recipients wallet address:</div>
      <div>{paymentInsert?.payee}</div>
      <div>send exact amount in one payment:</div>
      <div>{paymentInsert?.transactionAmount?.value} USDT</div>
      <div>
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            checkPaymentStatus();
          }}
          size="lg"
          variant="main"
          className="uppercase"
        >
          Check Payment
        </Button>
      </div>
      <div>
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            cancelPayment();
          }}
          size="lg"
          variant="default"
          className="uppercase"
        >
          Cancel Payment
        </Button>
      </div>
      <div>*please contant us if you have any questions</div>
    </div>
  );

  // return (
  //   <div className="mx-auto w-full space-y-4 p-40">
  //     <div className="flex max-w-5xl items-center justify-between text-sm">
  //       <span>amount : {euroAmount} eur</span>
  //       <span>{parseInt(cryptoAmount) / 1000000} USDT</span>
  //     </div>
  //     <div className="text-lg font-bold">make a payment</div>
  //     <div className="text-sm">order reference : #{orderId}</div>
  //     <div className="flex flex-col border p-4 md:flex-row">
  //       <div className="flex items-center justify-center p-4">
  //         <div className="h-56 w-56">
  //           {qrBase64Code && (
  //             <Image
  //               aspectRatio="1/1"
  //               src={qrBase64Code}
  //               fit="contain"
  //               alt="payment qr code"
  //             />
  //           )}
  //         </div>
  //       </div>
  //       <div className="flex-1 space-y-4 p-4">
  //         <div className="space-y-2">
  //           <div className="text-sm">send exact amount in one payment:</div>
  //           <div className="flex items-center space-x-2">
  //             <div className="text-2xl font-bold">
  //               {parseInt(cryptoAmount) / 1000000} USDT
  //             </div>
  //             <button
  //               className="text-sm text-blue-500 focus:text-blue-700"
  //               onClick={() =>
  //                 copyToClipboard(parseInt(cryptoAmount) / 1000000 + "")
  //               }
  //             >
  //               copy
  //             </button>
  //           </div>
  //           <div className="text-sm">network TRX</div>
  //         </div>
  //         <div className="space-y-2 border-t pt-4">
  //           <div className="text-sm">to this address:</div>
  //           <div className="flex items-center space-x-2">
  //             <div className="text-lg font-bold">{payeeAddress}</div>
  //             <button
  //               className="text-sm text-blue-500 focus:text-blue-700"
  //               onClick={() => copyToClipboard(payeeAddress)}
  //             >
  //               copy
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="text-sm">payment expires in: 9:57</div>
  //     <div className="text-sm">
  //       make sure that the network is TRON (TRX) if you send it in wrong network
  //       we would not be able to track your payment
  //     </div>
  //     <div className="text-sm">
  //       if you have any problems with payment please reach out us at{" "}
  //       <a href="#" className="text-blue-500">
  //         help@grbpwr.com
  //       </a>
  //     </div>
  //     <button className="text-sm text-red-500">cancel payment</button>
  //   </div>
  // );
}
