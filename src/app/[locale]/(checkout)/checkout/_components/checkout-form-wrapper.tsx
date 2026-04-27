"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe, StripeElementLocale } from "@stripe/stripe-js";
import { useTranslations } from "next-intl";

import type { AccountProfile } from "@/lib/stores/account-onboarding/store-types";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { SubmissionToaster } from "@/components/ui/toaster";

import { CheckoutFormSkeleton } from "./checkout-skeleton";
import NewOrderForm from "./new-order-form";
import { useStripeRedirect } from "./new-order-form/hooks/useStripeRedirect";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

function toAccountProfile(account: StorefrontAccount): AccountProfile {
  return {
    firstName: account.firstName?.trim() ?? "",
    lastName: account.lastName?.trim() ?? "",
    email: account.email?.trim() ?? "",
    accountTier: account.accountTier,
  };
}

interface ExtendedAppearance extends Appearance {
  fonts?: { cssSrc: string }[];
}

export function CheckoutFormWrapper({
  initialAccount,
}: {
  initialAccount: StorefrontAccount | null;
}) {
  const router = useRouter();
  const products = useCart((s) => s.products);
  const setSignedIn = useAccountOnboardingStore((s) => s.setSignedIn);
  const setAccount = useAccountOnboardingStore((s) => s.setAccount);
  const { dictionary } = useDataContext();
  const { currentCountry, languageId } = useTranslationsStore((state) => state);
  const tToaster = useTranslations("toaster");
  const [sessionAccount, setSessionAccount] = useState(initialAccount);
  const [resolvingSession, setResolvingSession] = useState(!initialAccount);

  const { toastOpen, toastMessage, setToastOpen } = useStripeRedirect({
    paymentFailedMessage: tToaster("payment_failed"),
  });

  const productsRef = useRef(products);
  productsRef.current = products;
  useEffect(() => {
    if (products.length > 0) return;

    const t = setTimeout(() => {
      if (productsRef.current.length === 0) {
        const country = currentCountry.countryCode?.toLowerCase() || "gb";
        const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
        router.replace(`/${country}/${locale}`);
      }
    }, 100);
    return () => clearTimeout(t);
  }, [products.length, languageId, currentCountry.countryCode, router]);

  useEffect(() => {
    let active = true;

    if (initialAccount) {
      setSessionAccount(initialAccount);
      setSignedIn(true);
      setAccount(toAccountProfile(initialAccount));
      setResolvingSession(false);
      return;
    }

    setResolvingSession(true);

    async function resolveSession() {
      try {
        const response = await fetch("/api/account/me", {
          headers: { Accept: "application/json" },
        });
        if (!active) return;

        if (!response.ok) {
          setSessionAccount(null);
          setSignedIn(false);
          setAccount(null);
          return;
        }

        const payload = (await response.json()) as {
          account?: StorefrontAccount | null;
        };
        if (!payload.account) {
          setSessionAccount(null);
          setSignedIn(false);
          setAccount(null);
          return;
        }

        setSessionAccount(payload.account);
        setSignedIn(true);
        setAccount(toAccountProfile(payload.account));
      } catch {
        if (!active) return;
        setSessionAccount(null);
        setSignedIn(false);
        setAccount(null);
      } finally {
        if (active) setResolvingSession(false);
      }
    }

    void resolveSession();

    return () => {
      active = false;
    };
  }, [initialAccount, setAccount, setSignedIn]);

  const currency =
    currentCountry.currencyKey || dictionary?.baseCurrency || "EUR";
  const [orderAmount, setOrderAmount] = useState<number>(1000);

  const handleAmountChange = (amount: number) => {
    setOrderAmount(amount);
  };

  if (resolvingSession) {
    return <CheckoutFormSkeleton />;
  }

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
    <>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: orderAmount,
          currency: currency?.toLowerCase(),
          appearance,
          paymentMethodCreation: "manual",
          locale: (LANGUAGE_ID_TO_LOCALE[languageId] ||
            "en") as StripeElementLocale,
        }}
      >
        <NewOrderForm
          onAmountChange={handleAmountChange}
          initialAccount={sessionAccount}
        />
      </Elements>
      <SubmissionToaster
        open={toastOpen}
        message={toastMessage}
        onOpenChange={setToastOpen}
      />
    </>
  );
}
