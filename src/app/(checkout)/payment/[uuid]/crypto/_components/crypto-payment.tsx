"use client";

import Link from "next/link";
import { common_PaymentInsert } from "@/api/proto-http/frontend";

import { Button } from "@/components/ui/button";

import { PaymentExpired } from "./payment-expired";
import { PaymentPending } from "./payment-pending";
import { PaymentSuccess } from "./payment-success";
import { usePaymentActions } from "./usePaymentActions";
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
  const {
    transactionStatus,
    paymentData,
    timeLeft,
    progressPercentage,
    isLoading,
    checkPaymentStatus,
    cancelPayment,
    renewPayment,
  } = usePaymentActions({
    paymentInsert,
    orderUuid,
    orderStatusId,
  });

  const originalAmount =
    paymentInsert?.transactionAmountPaymentCurrency?.value || "";
  const formattedAmount = formatNumber(originalAmount);

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
                originalAmount={originalAmount}
                progressPercentage={progressPercentage}
                isLoading={isLoading}
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
                originalAmount={originalAmount}
                isLoading={isLoading}
                renewPayment={renewPayment}
                checkPaymentStatus={checkPaymentStatus}
              />
            );
          case TransactionStatus.SUCCESS:
            return (
              <PaymentSuccess
                orderUuid={orderUuid || ""}
                formattedAmount={formattedAmount}
                originalAmount={originalAmount}
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
