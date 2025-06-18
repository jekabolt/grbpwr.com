import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { Props } from "./crypto-payment";
import { NetworkExpiration } from "./network-expiration";

interface SuccessProps extends Props {
  timeLeft: string;
  progressPercentage: number;
  formattedAmount: string;
  originalAmount: string;
  isLoading: boolean;
  checkPaymentStatus: () => void;
  cancelPayment: () => void;
}

export function PaymentPending({
  paymentInsert,
  orderUuid,
  qrBase64Code,
  timeLeft,
  progressPercentage,
  formattedAmount,
  originalAmount,
  isLoading,
  checkPaymentStatus,
  cancelPayment,
}: SuccessProps) {
  const { dictionary } = useDataContext();
  const baseCurrency = dictionary?.baseCurrency;
  return (
    <div className="w-full space-y-10 text-center lg:w-auto">
      <div className="space-y-4 text-center leading-none">
        <Text variant="uppercase">currency usdt</Text>
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <CopyText text={originalAmount} displayText={formattedAmount} />
            <Text>USDT</Text>
          </div>
          <div>
            <Text variant="inactive">
              ({paymentInsert?.transactionAmount?.value} {baseCurrency})
            </Text>
            <Text variant="inactive">*you pay network fee</Text>
          </div>
        </div>
      </div>
      <NetworkExpiration
        timeLeft={timeLeft}
        progressPercentage={progressPercentage}
      />
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <Text variant="uppercase">order reference:</Text>
          <div className="flex gap-1">
            <CopyText text={orderUuid || ""} cutText={4} variant="underlined" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-56 w-56 items-center justify-center">
            {qrBase64Code && (
              <Image
                aspectRatio="1/1"
                src={qrBase64Code}
                fit="contain"
                alt="payment qr code"
              />
            )}
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <Text>recipients wallet address:</Text>
              <CopyText
                text={paymentInsert?.payee || ""}
                variant="underlined"
              />
            </div>
            <div className="space-y-2 text-center">
              <Text>send exact amount in one payment:</Text>
              <div className="flex items-center justify-center gap-2">
                <CopyText text={originalAmount} displayText={formattedAmount} />
                <Text variant="uppercase">usdt</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex w-full flex-col gap-2 lg:w-auto">
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              checkPaymentStatus();
            }}
            disabled={isLoading}
            size="lg"
            variant="main"
            className="w-full uppercase lg:w-auto"
          >
            check payment
          </Button>
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              cancelPayment();
            }}
            disabled={isLoading}
            size="lg"
            variant="default"
            className="w-full uppercase lg:w-auto"
          >
            cancel payment
          </Button>
        </div>
        <Text variant="inactive" className="w-full text-center lg:w-1/2">
          *please contant us if you have any questions
        </Text>
      </div>
    </div>
  );
}
