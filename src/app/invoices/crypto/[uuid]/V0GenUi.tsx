/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aw1UvxUdWmN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

"use client";

import { useCopyToClipboard } from "@uidotdev/usehooks";

import Image from "@/components/ui/Image";

interface Props {
  euroAmount: string;
  cryptoAmount: string;
  orderId: string;
  payeeAddress: string;
  qrBase64Code?: string;
}

export default function Component({
  euroAmount,
  cryptoAmount,
  orderId,
  payeeAddress,
  qrBase64Code,
}: Props) {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  return (
    <div className="mx-auto w-full space-y-4 p-40">
      <div className="flex max-w-5xl items-center justify-between text-sm">
        <span>amount : {euroAmount} eur</span>
        <span>{parseInt(cryptoAmount) / 1000000} USDT</span>
      </div>
      <div className="text-lg font-bold">make a payment</div>
      <div className="text-sm">order reference : #{orderId}</div>
      <div className="flex flex-col border p-4 md:flex-row">
        <div className="flex items-center justify-center p-4">
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
        </div>
        <div className="flex-1 space-y-4 p-4">
          <div className="space-y-2">
            <div className="text-sm">send exact amount in one payment:</div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {parseInt(cryptoAmount) / 1000000} USDT
              </div>
              <button
                className="text-sm text-blue-500 focus:text-blue-700"
                onClick={() =>
                  copyToClipboard(parseInt(cryptoAmount) / 1000000 + "")
                }
              >
                copy
              </button>
            </div>
            <div className="text-sm">network TRX</div>
          </div>
          <div className="space-y-2 border-t pt-4">
            <div className="text-sm">to this address:</div>
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold">{payeeAddress}</div>
              <button
                className="text-sm text-blue-500 focus:text-blue-700"
                onClick={() => copyToClipboard(payeeAddress)}
              >
                copy
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm">payment expires in: 9:57</div>
      <div className="text-sm">
        make sure that the network is TRON (TRX) if you send it in wrong network
        we would not be able to track your payment
      </div>
      <div className="text-sm">
        if you have any problems with payment please reach out us at{" "}
        <a href="#" className="text-blue-500">
          help@grbpwr.com
        </a>
      </div>
      <button className="text-sm text-red-500">cancel payment</button>
    </div>
  );
}
