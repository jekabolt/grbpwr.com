"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useDataContext } from "@/components/contexts/DataContext";

import { StripeCardForm } from "./stripe-card-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function StripeForm({ clientSecret, uuid, amount, country }: Props) {
  const { dictionary } = useDataContext();
  const baseCurrency = dictionary?.baseCurrency?.toLowerCase();

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: Number(amount),
        currency: baseCurrency,
        appearance: {
          theme: "stripe",
          labels: "floating",
        },
        paymentMethodCreation: "manual",
        paymentMethodTypes: ["card", "klarna", "paypal"],
      }}
    >
      <StripeCardForm
        clientSecret={clientSecret}
        uuid={uuid}
        country={country}
      />
    </Elements>
  );
}

interface Props {
  clientSecret: string;
  uuid: string;
  amount: string;
  country: string;
}
