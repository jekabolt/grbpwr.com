/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aw1UvxUdWmN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { common_PaymentInsert } from "@/api/proto-http/frontend";

import { serviceClient } from "@/lib/api";
import { useCart } from "@/lib/stores/cart/store-provider";
import { Button } from "@/components/ui/button";

import { PaymentExpired } from "./payment-expired";
import { PaymentPending } from "./payment-pending";
import { PaymentSuccess } from "./payment-success";
import { formatNumber } from "./utility";

export interface Props {
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

export function CryptoPayment({
  paymentInsert,
  qrBase64Code,
  orderUuid,
  orderStatusId,
}: Props) {
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.PENDING,
  );
  const [timeLeft, setTimeLeft] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const formattedAmount = formatNumber(
    paymentInsert?.transactionAmountPaymentCurrency?.value || "",
  );
  const clearCart = useCart((cart) => cart.clearCart);
  const [paymentData, setPaymentData] = useState(paymentInsert);

  const checkPaymentStatus = async () => {
    try {
      const response = await serviceClient.GetOrderInvoice({
        orderUuid: orderUuid?.toString() || "",
        paymentMethod: paymentInsert?.paymentMethod,
      });
      if (response.payment?.isTransactionDone) {
        setTransactionStatus(TransactionStatus.SUCCESS);
        clearCart();
      }
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
    } catch (error) {
      console.error("Error cancelling payment:", error);
    }
  };

  const renewPayment = async () => {
    try {
      const response = await serviceClient.GetOrderInvoice({
        orderUuid: orderUuid?.toString() || "",
        paymentMethod: paymentInsert?.paymentMethod,
      });
      if (response.payment) {
        setPaymentData(response.payment);
        setTransactionStatus(TransactionStatus.PENDING);
        setProgressPercentage(0);
      }
    } catch (error) {
      console.error("Error renewing payment:", error);
    }
  };

  useEffect(() => {
    if (!paymentData?.expiredAt) return;

    const calculateTimeLeft = () => {
      const expirationDate = new Date(paymentData?.expiredAt ?? "");

      const now = new Date();
      const difference = expirationDate.getTime() - now.getTime();
      console.log("difference", difference);

      const totalDuration = 15 * 60 * 1000;

      const initialFill = 20;

      const calculatedPercentage = Math.min(
        100,
        Math.max(
          initialFill,
          initialFill + (100 - initialFill) * (1 - difference / totalDuration),
        ),
      );
      setProgressPercentage(calculatedPercentage);

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
        setProgressPercentage(100);
        setTransactionStatus(TransactionStatus.EXPIRED);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [paymentData?.expiredAt]);

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
    <div className="mt-16 flex w-full flex-col items-center justify-start gap-12 px-2.5 leading-none lg:w-auto lg:p-0">
      {(() => {
        switch (transactionStatus) {
          case TransactionStatus.PENDING:
            return (
              <PaymentPending
                paymentInsert={paymentData}
                orderUuid={orderUuid || ""}
                qrBase64Code={qrBase64Code}
                timeLeft={timeLeft}
                formattedAmount={formattedAmount}
                progressPercentage={progressPercentage}
                checkPaymentStatus={checkPaymentStatus}
                cancelPayment={cancelPayment}
              />
            );
          case TransactionStatus.EXPIRED:
            return (
              <PaymentExpired
                paymentInsert={paymentData}
                orderUuid={orderUuid || ""}
                timeLeft={timeLeft}
                progressPercentage={progressPercentage}
                formattedAmount={formattedAmount}
                renewPayment={renewPayment}
                checkPaymentStatus={checkPaymentStatus}
              />
            );
          case TransactionStatus.SUCCESS:
            return (
              <PaymentSuccess
                orderUuid={orderUuid || ""}
                formattedAmount={formattedAmount}
              />
            );
          default:
            return null;
        }
      })()}
      <Button asChild className="text-textInactiveColor">
        <Link href="/support">contact support</Link>
      </Button>
    </div>
  );
}
