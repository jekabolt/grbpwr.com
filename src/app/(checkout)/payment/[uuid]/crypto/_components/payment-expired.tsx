import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";
import { Text } from "@/components/ui/text";

import { Props } from "./crypto-payment";
import { NetworkExpiration } from "./network-expiration";

interface ExpiredProps extends Props {
  timeLeft: string;
  progressPercentage: number;
  formattedAmount: string;
  renewPayment: () => void;
  checkPaymentStatus: () => void;
}

export function PaymentExpired({
  paymentInsert,
  orderUuid,
  timeLeft,
  progressPercentage,
  formattedAmount,
  renewPayment,
  checkPaymentStatus,
}: ExpiredProps) {
  const { dictionary } = useDataContext();
  const baseCurrency = dictionary?.baseCurrency;

  return (
    <div className="w-full space-y-10 lg:w-2/3">
      <div className="space-y-4 text-center">
        <Text variant="uppercase">order has been expired</Text>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CopyText text={formattedAmount} />
            <Text variant="uppercase">usdt</Text>
          </div>
          <Text variant="inactive">
            ({paymentInsert?.transactionAmount?.value} {baseCurrency})
          </Text>
        </div>
      </div>
      <NetworkExpiration
        timeLeft={timeLeft}
        progressPercentage={progressPercentage}
      />
      <div className="flex items-center justify-center gap-2">
        <Text variant="uppercase">order reference:</Text>
        <CopyText text={orderUuid || ""} cutText={4} variant="underlined" />
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Button
            onClick={renewPayment}
            size="lg"
            variant="main"
            className="w-full uppercase lg:w-auto"
          >
            renew payment
          </Button>
          <Button
            onClick={checkPaymentStatus}
            size="lg"
            variant="main"
            className="w-full uppercase lg:w-auto"
          >
            check payment
          </Button>
        </div>
        <Text variant="inactive" className="w-full text-center">
          *if you sent a payment but it didn&apos;t appear, click &quot;check
          payment&quot; and save your order ref
        </Text>
      </div>
    </div>
  );
}
