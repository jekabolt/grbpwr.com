"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error: backendError, clientSecret } = await fetch(
      "/api/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 1000 }), // Amount in cents
      },
    ).then((res) => res.json());

    if (backendError) {
      setError(backendError.message);
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: "Customer Name",
          },
        },
      },
    );

    if (error) {
      setError(`Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setSucceeded(true);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md">
      <div className="mb-4">
        <label
          htmlFor="card-element"
          className="block text-sm font-medium text-gray-700"
        >
          Credit or debit card
        </label>
        <div className="mt-1">
          <CardElement id="card-element" className="rounded-md border p-2" />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? "Processing..." : "Pay"}
      </button>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {succeeded && (
        <div className="mt-4 text-green-600">Payment succeeded!</div>
      )}
    </form>
  );
}

export default function StripePaymentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Stripe Payment</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
