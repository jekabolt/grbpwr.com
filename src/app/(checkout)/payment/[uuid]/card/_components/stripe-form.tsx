"use client";

import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";

import { useDataContext } from "@/components/contexts/DataContext";

import { StripeCardForm } from "./stripe-card-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function StripeForm({ clientSecret, uuid, amount, country }: Props) {
  const { dictionary } = useDataContext();
  const baseCurrency = dictionary?.baseCurrency?.toLowerCase();

  const appearance: Appearance = {
    theme: "stripe",
    labels: "floating",
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: Number(amount),
        currency: baseCurrency,
        appearance,
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
