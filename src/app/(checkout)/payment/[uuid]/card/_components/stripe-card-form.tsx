"use client";

import { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";

export function StripeCardForm({ clientSecret, uuid, country }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(undefined);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      clientSecret,
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/${uuid}`,
        payment_method_data: {
          billing_details: {
            address: {
              country: country,
            },
          },
        },
      },
    });

    setIsProcessing(false);

    if (error) {
      console.error("Error confirming payment:", error.message);
      setErrorMessage(error.message);
    } else {
      console.log("Payment successful");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-10">
      {clientSecret && (
        <PaymentElement
          options={{
            fields: {
              billingDetails: {
                address: {
                  country: "never",
                },
              },
            },
          }}
        />
      )}

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      <Button
        variant="main"
        size="lg"
        className="w-full uppercase"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processing..." : "pay"}
      </Button>
    </form>
  );
}

interface Props {
  clientSecret: string;
  uuid: string;
  country: string;
}
