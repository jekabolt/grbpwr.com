"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe, StripeElementLocale } from "@stripe/stripe-js";
import { useTranslations } from "next-intl";

import {
  resolveAccountSession,
  storefrontAccountToProfile,
} from "@/lib/storefront-account/client-session";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { SubmissionToaster } from "@/components/ui/toaster";

import { CheckoutLoadingShell } from "./checkout-skeleton";
import NewOrderForm from "./new-order-form";
import { useCheckoutGuestPersistence } from "./use-checkout-guest-persistence";
import { useStripeRedirect } from "./new-order-form/hooks/useStripeRedirect";

export function CheckoutFormWrapper({
  initialAccount,
  initialGuestCheckout = false,
}: {
  initialAccount: StorefrontAccount | null;
  initialGuestCheckout?: boolean;
}) {
  const router = useRouter();
  // Lazy-init so the Stripe SDK only kicks off on mount of the checkout form,
  // not at module evaluation time.
  const [stripePromise] = useState(() =>
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!),
  );
  const products = useCart((s) => s.products);
  const isSignedIn = useAccountOnboardingStore((s) => s.isSignedIn);
  const setSignedIn = useAccountOnboardingStore((s) => s.setSignedIn);
  const setAccount = useAccountOnboardingStore((s) => s.setAccount);
  const { guestCheckout, setGuestCheckout } =
    useCheckoutGuestPersistence(initialGuestCheckout);
  const { dictionary } = useDataContext();
  const { currentCountry, languageId } = useTranslationsStore((state) => state);
  const tToaster = useTranslations("toaster");
  const [sessionAccount, setSessionAccount] = useState(initialAccount);
  const [resolvingSession, setResolvingSession] = useState(!initialAccount);

  const [isOrderRedirecting, setIsOrderRedirecting] = useState(false);

  const { toastOpen, toastMessage, setToastOpen } = useStripeRedirect({
    paymentFailedMessage: tToaster("payment_failed"),
  });

  const productsRef = useRef(products);
  productsRef.current = products;
  useEffect(() => {
    if (isOrderRedirecting) return;
    if (products.length > 0) return;

    const t = setTimeout(() => {
      if (isOrderRedirecting) return;
      if (productsRef.current.length === 0) {
        const country = currentCountry.countryCode?.toLowerCase() || "gb";
        const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
        router.replace(`/${country}/${locale}`);
      }
    }, 100);
    return () => clearTimeout(t);
  }, [
    products.length,
    languageId,
    currentCountry.countryCode,
    router,
    isOrderRedirecting,
  ]);

  useLayoutEffect(() => {
    if (!initialAccount) return;

    setSessionAccount(initialAccount);
    setSignedIn(true);
    setAccount(storefrontAccountToProfile(initialAccount));
    setResolvingSession(false);
  }, [initialAccount, setAccount, setSignedIn]);

  useEffect(() => {
    let active = true;
    let resolveGeneration = 0;

    if (initialAccount || sessionAccount) {
      return;
    }

    setResolvingSession(true);

    async function resolveSession() {
      const generation = ++resolveGeneration;
      const account = await resolveAccountSession();
      if (!active || generation !== resolveGeneration) return;

      if (account) {
        setSessionAccount(account);
        setSignedIn(true);
        setAccount(storefrontAccountToProfile(account));
      } else {
        setSessionAccount(null);
        setSignedIn(false);
        setAccount(null);
      }

      setResolvingSession(false);
    }

    void resolveSession();

    return () => {
      active = false;
    };
  }, [initialAccount, sessionAccount, setAccount, setSignedIn]);

  const handleCheckoutLoginSuccess = (account: StorefrontAccount) => {
    setSessionAccount(account);
    setSignedIn(true);
    setAccount(storefrontAccountToProfile(account));
    setResolvingSession(false);
  };

  const currency =
    currentCountry.currencyKey || dictionary?.baseCurrency || "EUR";
  const [orderAmount, setOrderAmount] = useState<number>(1000);

  const handleAmountChange = (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setOrderAmount(amount);
  };

  const showAuthOnlyPadding = !isSignedIn && !guestCheckout;

  if (resolvingSession) {
    return (
      <CheckoutLoadingShell
        initialAccount={initialAccount}
        guestCheckout={guestCheckout || initialGuestCheckout}
      />
    );
  }

  const appearance: Appearance = {
    theme: "stripe",
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
      ".TabLabel": {
        textTransform: "lowercase",
      },
    },
  };

  return (
    <>
      <div
        className={cn(
          "px-2.5 pb-8 pt-20 lg:relative lg:min-h-dvh lg:px-32 lg:py-24",
          {
            "lg:pb-0 lg:pt-24": showAuthOnlyPadding,
          },
        )}
      >
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: orderAmount,
            currency: currency?.toLowerCase(),
            appearance,
            locale: (LANGUAGE_ID_TO_LOCALE[languageId] ||
              "en") as StripeElementLocale,
          }}
        >
          <NewOrderForm
            onAmountChange={handleAmountChange}
            initialAccount={initialAccount ?? sessionAccount}
            onLoginSuccess={handleCheckoutLoginSuccess}
            onOrderRedirectStart={() => setIsOrderRedirecting(true)}
            guestCheckout={guestCheckout}
            setGuestCheckout={setGuestCheckout}
          />
        </Elements>
      </div>
      <SubmissionToaster
        open={toastOpen}
        message={toastMessage}
        onOpenChange={setToastOpen}
      />
    </>
  );
}
