import Link from "next/link";

import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";
import { CopyCheckIcon } from "@/components/ui/icons/copy-check-icon";
import { WhiteLogo } from "@/components/ui/icons/white-logo";
import { Text } from "@/components/ui/text";

interface Props {
  orderUuid: string;
  formattedAmount: string;
  originalAmount: string;
}

export function PaymentSuccess({
  orderUuid,
  formattedAmount,
  originalAmount,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 lg:w-auto">
      <WhiteLogo className="aspect-square w-28" />
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <CopyCheckIcon />
          <Text variant="uppercase">payment success</Text>
        </div>
        <div className="space-y-2">
          <Text>we have received payment amount of</Text>
          <div className="flex items-center justify-center gap-2">
            <CopyText text={originalAmount} displayText={formattedAmount} />
            <Text variant="uppercase">usdt</Text>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Text variant="uppercase">order reference:</Text>
        <CopyText text={orderUuid || ""} variant="underlined" cutText={4} />
      </div>
      <Button
        variant="main"
        size="lg"
        asChild
        className="w-full uppercase lg:w-auto"
      >
        <Link href={`/order/${orderUuid}`}>order info</Link>
      </Button>
    </div>
  );
}
