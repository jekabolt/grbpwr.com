"use client";

import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";

import { useDataContext } from "@/components/contexts/DataContext";

import NewOrderForm from "./new-order-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// Расширенный интерфейс для поддержки fonts
interface ExtendedAppearance extends Appearance {
  fonts?: { cssSrc: string }[];
}

export function CheckoutFormWrapper() {
  const { dictionary } = useDataContext();
  const baseCurrency = dictionary?.baseCurrency?.toLowerCase();

  // Appearance с кастомным полем fonts и типом ExtendedAppearance
  const appearance: ExtendedAppearance = {
    theme: "stripe", // 'stripe', 'night', 'flat', or 'none'
    fonts: [
      {
        cssSrc: "/fonts/FeatureMono-Regular.ttf",
      },
    ],
    labels: "floating", // 'floating' or 'above'
    variables: {
      colorPrimary: "#000000",
      colorBackground: "#ffffff",
      colorText: "#000000",
      colorDanger: "#df1b41",
      fontFamily: "'FeatureMono', monospace",
      focusBoxShadow: "none",
      borderRadius: "0px",
      fontSizeBase: "12px",
    },
    rules: {
      ".Input": {
        border: "1px solid #B4B4B4",
        boxShadow: "none",
        height: "16px",
        padding: "8px 16px",
      },
      ".Input:focus": {
        border: "1px solid #000000",
        outline: "none",
      },
      ".Input::placeholder": {
        color: "#B4B4B4",
      },
      ".Label": {
        textTransform: "uppercase",
      },
      ".Label--focused": {
        color: "#B4B4B4",
      },
      ".Tab": {
        display: "flex",
        flexDirection: "row",
      },
      ".TabLabel": {
        textTransform: "lowercase",
      },
    },
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: 1000,
        currency: baseCurrency,
        appearance,
        paymentMethodCreation: "manual",
        // paymentMethodTypes: ["card", "klarna", "paypal"],
      }}
    >
      <NewOrderForm />
    </Elements>
  );
}
