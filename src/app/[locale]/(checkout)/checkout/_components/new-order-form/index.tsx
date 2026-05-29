"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { formatPrice } from "@/lib/currency";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";
import { AccountSignedInSection } from "@/app/[locale]/account/account-signed-in-section";
import {
  AccountLoginForm,
  type AccountLoginStep,
} from "@/app/[locale]/account/authorization/account-login-form";
import { accountNeedsNameCompletion } from "@/app/[locale]/account/utils/utility";

import { CheckoutSignedInSkeleton } from "../checkout-skeleton";
import ContactFieldsGroup from "./contact-fields-group";
import { useAutoGroupOpen } from "./hooks/useAutoGroupOpen";
import { useCheckoutEffects } from "./hooks/useCheckout";
import { useCheckoutFormAnalytics } from "./hooks/useCheckoutFormAnalytics";
import { useCheckoutSubmit } from "./hooks/useCheckoutSubmit";
import { useComplimentaryShippingToast } from "./hooks/useComplimentaryShippingToast";
import { useOrderPersistence } from "./hooks/useOrderPersistence";
import { useValidatedOrder } from "./hooks/useValidatedOrder";
import { MobileOrderSummary } from "./mobile-order-summary";
import { OrderProducts } from "./order-products";
import PaymentFieldsGroup from "./payment-fields-group";
import { PriceSummary } from "./price-summary";
import PromoCode from "./PromoCode";
import { CheckoutData, checkoutSchema, defaultData } from "./schema";
import ShippingFieldsGroup from "./shipping-fields-group";
import { isStripeCardPaymentMethod } from "./utils";

const CHECKOUT_PROFILE_COMPLETED_EMAIL_KEY =
  "grbpwr.checkout.profileCompletedEmail";

type NewOrderFormProps = {
  guestCheckout: boolean;
  initialAccount: StorefrontAccount | null;
  onAmountChange: (amount: number) => void;
  onOrderRedirectStart?: () => void;
  setGuestCheckout: (value: boolean) => void;
};

export default function NewOrderForm({
  initialAccount,
  guestCheckout,
  onAmountChange,
  onOrderRedirectStart,
  setGuestCheckout,
}: NewOrderFormProps) {
  const { currentCountry } = useTranslationsStore((state) => state);
  const { products, totalPrice, validatedCurrency } = useCart((s) => s);
  const { isSignedIn } = useAccountOnboardingStore((s) => s);
  const [checkoutLoginStep, setCheckoutLoginStep] =
    useState<AccountLoginStep>("email");
  const [checkoutLoginVerified, setCheckoutLoginVerified] = useState(false);
  const [checkoutProfileCompleted, setCheckoutProfileCompleted] =
    useState(false);

  useLayoutEffect(() => {
    const email = initialAccount?.email?.trim();
    if (!email || typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem(
        CHECKOUT_PROFILE_COMPLETED_EMAIL_KEY,
      );
      if (stored === email) setCheckoutProfileCompleted(true);
    } catch {
      /* ignore */
    }
  }, [initialAccount?.email]);

  useEffect(() => {
    if (!initialAccount) return;
    if (!accountNeedsNameCompletion(initialAccount)) {
      try {
        sessionStorage.removeItem(CHECKOUT_PROFILE_COMPLETED_EMAIL_KEY);
      } catch {
        /* ignore */
      }
    }
  }, [initialAccount]);

  useEffect(() => {
    if (isSignedIn) {
      setGuestCheckout(false);
    }
  }, [isSignedIn]);

  const formRef = useRef<HTMLFormElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("checkout");
  const tToaster = useTranslations("toaster");
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { ...defaultData, country: currentCountry.countryCode },
  });

  const { order, validateItems, orderCurrency, validationToastOpen, validationToastMessage, setValidationToastOpen } = useValidatedOrder(form, {
    validationErrorFallback: tToaster("validation_error"),
  });
  const { clearFormData, applyCheckoutIdentity } = useOrderPersistence(
    form,
    currentCountry.countryCode,
    {
      isSignedIn,
      initialAccount,
    },
  );
  const { isGroupOpen, handleGroupToggle, isGroupDisabled, handleFormChange } =
    useAutoGroupOpen(form);
  const {
    showComplimentaryToast,
    complimentaryToastMessage,
    complimentaryToastOpen,
    setComplimentaryToastOpen,
  } = useComplimentaryShippingToast(order, orderCurrency);

  const {
    orderModifiedToastOpen,
    toastMessage,
    setOrderModifiedToastOpen,
    setToastMessage,
  } = useCheckoutEffects({
    order,
    products,
    form,
    countryCode: currentCountry.countryCode || "",
    orderCurrency,
    onAmountChange,
    handleFormChange,
  });

  const handlePromoError = (message: string) => {
    setToastMessage(message);
    setOrderModifiedToastOpen(true);
  };

  const {
    loading,
    isPaymentElementComplete,
    paymentMethod,
    isPaymentFieldsValid,
    setIsPaymentElementComplete,
    handleValidSubmit,
    handleSubmitInvalid,
  } = useCheckoutSubmit({
    form,
    order,
    orderCurrency,
    stripe,
    elements,
    contactRef: contactRef as React.RefObject<HTMLDivElement | null>,
    shippingRef: shippingRef as React.RefObject<HTMLDivElement | null>,
    paymentRef: paymentRef as React.RefObject<HTMLDivElement | null>,
    fillRequiredFieldsMessage: tToaster("fill_required_fields"),
    paymentFailedMessage: tToaster("payment_failed"),
    resolveToasterMessage: tToaster,
    isGroupOpen,
    handleGroupToggle,
    validateItems,
    clearFormData,
    setToastMessage,
    setOrderModifiedToastOpen,
    onOrderRedirectStart,
  });

  useCheckoutFormAnalytics({
    formRef,
    products,
    isPaymentElementComplete,
    paymentMethod,
  });

  const showCheckoutFields = isSignedIn || guestCheckout;
  const hideOrderSummary = !showCheckoutFields && checkoutLoginStep === "code";
  const showProfilePrompt =
    isSignedIn &&
    !!initialAccount &&
    accountNeedsNameCompletion(initialAccount) &&
    !checkoutProfileCompleted;
  const showMobileOrderSummaryOverlay =
    (!showCheckoutFields && checkoutLoginStep === "email") || showProfilePrompt;
  const showCheckoutForm = showCheckoutFields && !showProfilePrompt;

  const centerAuthOnMobile = !showCheckoutFields || showProfilePrompt;
  const placeOrderDisabled =
    loading || !form.formState.isValid || !isPaymentFieldsValid;
  const placeOrderLabel = `${t("place order")} ${formatPrice(order?.totalSale?.value ?? totalPrice ?? 0, orderCurrency || validatedCurrency || "EUR", currencySymbols[orderCurrency || validatedCurrency || "EUR"])}`;

  const handleProfileCompleted = (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    country: string;
  }) => {
    setCheckoutProfileCompleted(true);
    applyCheckoutIdentity(data, {
      overwriteExisting: true,
      shouldValidate: true,
    });
    try {
      const e = data.email?.trim();
      if (e) sessionStorage.setItem(CHECKOUT_PROFILE_COMPLETED_EMAIL_KEY, e);
    } catch {
      /* ignore */
    }
  };

  const awaitingPostLoginHydration =
    checkoutLoginVerified && !guestCheckout && !isSignedIn && !initialAccount;

  if (awaitingPostLoginHydration) {
    return <CheckoutSignedInSkeleton />;
  }

  return (
    <>
      <Form {...form}>
        <div className="relative h-full w-full space-y-14 lg:space-y-0">
          <div
            className={cn(
              "flex flex-col items-start gap-14 pb-12 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-2 lg:items-start lg:gap-28 lg:p-0",
              centerAuthOnMobile &&
                "min-h-[calc(100dvh-7rem)] justify-center lg:min-h-0 lg:justify-start",
            )}
          >
            {!hideOrderSummary && (
              <div
                className={cn("z-40 block lg:hidden", {
                  "fixed inset-x-2.5 bottom-6":
                    !showCheckoutFields || showProfilePrompt,
                  "w-full": showCheckoutFields && !showProfilePrompt,
                })}
              >
                <MobileOrderSummary
                  form={form}
                  order={order}
                  validatedProducts={order?.validItems}
                  orderCurrency={orderCurrency}
                  disabled={loading}
                  overlay={showMobileOrderSummaryOverlay}
                />
              </div>
            )}
            {!showCheckoutFields ? (
              <div className="flex min-h-0 w-full lg:items-start lg:justify-center">
                <AccountLoginForm
                  isCheckout
                  onStepChange={setCheckoutLoginStep}
                  onVerified={() => setCheckoutLoginVerified(true)}
                  onCheckoutAsGuest={() => setGuestCheckout(true)}
                />
              </div>
            ) : showProfilePrompt ? (
              <div className="flex min-h-0 w-full shrink-0 lg:items-start lg:justify-center">
                <AccountSignedInSection
                  account={initialAccount}
                  isCheckout
                  onProfileCompleted={handleProfileCompleted}
                />
              </div>
            ) : (
              <form
                id="checkout-order-form"
                ref={formRef}
                onSubmit={form.handleSubmit(
                  handleValidSubmit,
                  handleSubmitInvalid,
                )}
                className="contents"
              >
                <div className="w-full space-y-10 lg:space-y-16">
                  <>
                    <div ref={contactRef}>
                      <ContactFieldsGroup
                        loading={loading}
                        isOpen={isGroupOpen("contact")}
                        isSignedIn={isSignedIn}
                        initialAccountEmail={initialAccount?.email ?? ""}
                        onToggle={() => handleGroupToggle("contact")}
                        disabled={isGroupDisabled("contact") || loading}
                      />
                    </div>
                    <div ref={shippingRef}>
                      <ShippingFieldsGroup
                        loading={loading}
                        order={order}
                        account={initialAccount as StorefrontAccount}
                        isOpen={isGroupOpen("shipping")}
                        onToggle={() => handleGroupToggle("shipping")}
                        disabled={isGroupDisabled("shipping") || loading}
                      />
                    </div>
                    <div ref={paymentRef}>
                      <PaymentFieldsGroup
                        loading={loading}
                        form={form}
                        validateItems={validateItems}
                        onPromoError={handlePromoError}
                        isOpen={isGroupOpen("payment")}
                        onToggle={() => handleGroupToggle("payment")}
                        disabled={isGroupDisabled("payment") || loading}
                        onPaymentElementChange={setIsPaymentElementComplete}
                        showPaymentError={
                          (form.formState.isSubmitted ||
                            form.formState.submitCount > 0) &&
                          !isPaymentFieldsValid &&
                          isStripeCardPaymentMethod(paymentMethod)
                        }
                      />
                    </div>
                  </>
                </div>
              </form>
            )}
            <div
              className={cn(
                "fixed inset-x-2.5 bottom-3 z-40 lg:sticky lg:top-16 lg:z-auto lg:flex lg:min-h-0 lg:flex-col lg:self-start",
                showCheckoutForm
                  ? "lg:h-[calc(100dvh-6rem)] lg:max-h-[calc(100dvh-6rem)]"
                  : "lg:h-[calc(100dvh-4rem)] lg:max-h-[calc(100dvh-4rem)]",
                !showCheckoutForm && "hidden lg:flex",
              )}
            >
              {showCheckoutForm && (
                <Button
                  form="checkout-order-form"
                  type="submit"
                  variant="main"
                  size="lg"
                  className="w-full uppercase lg:hidden"
                  disabled={placeOrderDisabled}
                  loading={loading}
                  loadingType="order-processing"
                  analyticsButtonId="place_order"
                >
                  {placeOrderLabel}
                </Button>
              )}
              <div className="hidden h-full min-h-0 flex-col gap-8 lg:flex">
                <Text
                  variant="uppercase"
                  className={cn("shrink-0", {
                    "text-textInactiveColor": loading,
                  })}
                >
                  {t("order summary")}
                </Text>
                <div
                  className={cn("shrink-0 space-y-8", {
                    "text-textInactiveColor": loading,
                  })}
                >
                  {showCheckoutForm && (
                    <PromoCode
                      freeShipmentCarrierId={2}
                      form={form}
                      loading={loading}
                      validateItems={validateItems}
                      onError={handlePromoError}
                      currency={
                        orderCurrency || currentCountry.currencyKey || "EUR"
                      }
                    />
                  )}
                  <PriceSummary
                    form={form}
                    order={order}
                    orderCurrency={orderCurrency}
                  />
                  {showCheckoutForm && (
                    <Button
                      form="checkout-order-form"
                      type="submit"
                      variant="main"
                      size="lg"
                      className="w-full uppercase"
                      disabled={placeOrderDisabled}
                      loading={loading}
                      loadingType="order-processing"
                      analyticsButtonId="place_order"
                    >
                      {placeOrderLabel}
                    </Button>
                  )}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <OrderProducts
                    validatedProducts={order?.validItems}
                    currencyKey={orderCurrency}
                    disabled={loading}
                    disableProductLinks
                    className="min-h-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
      <SubmissionToaster
        open={orderModifiedToastOpen}
        message={toastMessage}
        onOpenChange={setOrderModifiedToastOpen}
      />
      <SubmissionToaster
        open={validationToastOpen}
        message={validationToastMessage}
        onOpenChange={setValidationToastOpen}
      />
      {showComplimentaryToast && complimentaryToastMessage && (
        <SubmissionToaster
          open={complimentaryToastOpen}
          message={complimentaryToastMessage}
          onOpenChange={(open) => !open && setComplimentaryToastOpen(false)}
          duration={Infinity}
        />
      )}
    </>
  );
}
