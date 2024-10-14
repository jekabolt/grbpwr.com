"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutForm";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51PQqJsP97IsmiR4DHmNimxWDeAAMhzOww6NNyrvYKyqW0nsRPKbfivB8M2gzeSJSgJktys1EWbHNfaqvvqDv5Mlq00rjie9vDF",
);

export default function StripeSecureCardForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}
