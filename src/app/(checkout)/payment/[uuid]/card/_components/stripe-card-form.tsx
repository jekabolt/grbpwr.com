"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

import { Button } from "@/components/ui/button";

export function StripeCardForm({ clientSecret, uuid }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      console.error("Error submitting payment element:", submitError.message);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/order/${uuid}`,
      },
    });

    if (error) {
      console.error("Error confirming payment:", error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
      console.log("Payment successful");
    }
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "auto",
    fields: {
      billingDetails: {
        address: {
          country: "never",
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-10">
      {clientSecret && <PaymentElement options={paymentElementOptions} />}
      <Button
        variant="main"
        size="lg"
        className="w-full uppercase"
        disabled={!stripe}
      >
        pay
      </Button>
    </form>
  );
}

interface Props {
  clientSecret: string;
  uuid?: string;
}
