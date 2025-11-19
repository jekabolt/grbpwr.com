"use client";

import { useState } from "react";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe, StripeElementLocale } from "@stripe/stripe-js";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";

import NewOrderForm from "./new-order-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface ExtendedAppearance extends Appearance {
  fonts?: { cssSrc: string }[];
}

export function CheckoutFormWrapper() {
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);
  const { selectedCurrency } = useCurrency((state) => state);

  const currency = selectedCurrency || dictionary?.baseCurrency || "EUR";
  const [orderAmount, setOrderAmount] = useState<number>(1000);

  const handleAmountChange = (amount: number) => {
    setOrderAmount(amount);
  };

  const appearance: ExtendedAppearance = {
    theme: "stripe",
    fonts: [
      {
        cssSrc: "/fonts/FeatureMono-Regular.ttf",
      },
    ],
    labels: "floating",
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
        amount: orderAmount,
        currency: currency?.toLowerCase(),
        appearance,
        paymentMethodCreation: "manual",
        locale: LANGUAGE_ID_TO_LOCALE[languageId] as StripeElementLocale,
      }}
    >
      <NewOrderForm onAmountChange={handleAmountChange} />
    </Elements>
  );
}
