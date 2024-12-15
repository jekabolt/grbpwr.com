"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { StripeCardForm } from "./stripe-card-form";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export function StripeForm({ clientSecret, uuid }: Props) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <StripeCardForm clientSecret={clientSecret} uuid={uuid} />
    </Elements>
  );
}

interface Props {
  clientSecret: string;
  uuid: string;
}
