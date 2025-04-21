"use client";

import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElementOptions } from "@stripe/stripe-js";

import { Button } from "@/components/ui/button";

export function StripeCardForm({ clientSecret, uuid }: Props) {
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

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name",
            email: "customer@example.com",
          },
        },
      },
    );

    setIsProcessing(false);

    if (error) {
      console.error("Error confirming payment:", error.message);
      setErrorMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("Payment successful");
      // Navigate to success page
      window.location.href = `${window.location.origin}/order/${uuid}`;
    }
  };

  const cardElementOptions: StripeCardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-10">
      <div className="rounded-md border p-4">
        <CardElement options={cardElementOptions} />
      </div>

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
  uuid?: string;
}
