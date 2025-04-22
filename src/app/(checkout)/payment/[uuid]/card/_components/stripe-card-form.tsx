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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setIsLoading(false);
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

    setIsLoading(false);

    if (error) {
      console.error("Error confirming payment:", error.message);
    } else {
      console.log("Payment successful");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col justify-between gap-2.5"
    >
      <div className="min-h-72">
        {clientSecret && (
          <PaymentElement
            options={{
              layout: "tabs",
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
      </div>

      <Button
        variant="main"
        size="lg"
        className="w-full uppercase"
        disabled={!stripe || isLoading}
      >
        pay
      </Button>
    </form>
  );
}

interface Props {
  clientSecret: string;
  uuid: string;
  country: string;
}
