"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { Elements } from "@stripe/react-stripe-js";

import { Appearance, loadStripe, StripeElementLocale } from "@stripe/stripe-js";

import { useCart } from "@/lib/stores/cart/store-provider";
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
  const router = useRouter();
  const products = useCart((s) => s.products);
  const { dictionary } = useDataContext();
  const { currentCountry, languageId } = useTranslationsStore((state) => state);

  // Redirect to home when landing on checkout with empty cart (e.g. direct link)
  // Preserve current locale
  const productsRef = useRef(products);
  productsRef.current = products;
  useEffect(() => {
    if (products.length > 0) return;

    const t = setTimeout(() => {
      if (productsRef.current.length === 0) {
        const country = currentCountry.countryCode?.toLowerCase() || "us";
        const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
        router.replace(`/${country}/${locale}`);
      }
    }, 100); // brief delay for cart persist rehydration
    return () => clearTimeout(t);
  }, [products.length, languageId, currentCountry.countryCode, router]);

  const currency =
    currentCountry.currencyKey || dictionary?.baseCurrency || "EUR";
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
        locale: (LANGUAGE_ID_TO_LOCALE[languageId] || "en") as StripeElementLocale,
      }}
    >
      <NewOrderForm onAmountChange={handleAmountChange} />
    </Elements>
  );
}
