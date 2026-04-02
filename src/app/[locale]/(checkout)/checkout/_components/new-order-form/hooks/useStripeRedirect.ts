import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

interface UseStripeRedirectProps {
  setToastMessage: (msg: string) => void;
  setOrderModifiedToastOpen: (open: boolean) => void;
  paymentFailedMessage: string;
}

export function useStripeRedirect({
  setToastMessage,
  setOrderModifiedToastOpen,
  paymentFailedMessage,
}: UseStripeRedirectProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { currentCountry, languageId } = useTranslationsStore((state) => state);
  const { handlePaymentFailed } = useCheckoutAnalytics();

  useEffect(() => {
    const redirectStatus = searchParams.get("redirect_status");
    const orderUuid = searchParams.get("order_uuid");
    const email = searchParams.get("email");

    if (!redirectStatus) return;

    if (redirectStatus === "succeeded" && orderUuid && email) {
      const country = currentCountry.countryCode?.toLowerCase() || "gb";
      const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
      window.location.href = `/${country}/${locale}/order/${orderUuid}/${email}?redirect_status=succeeded`;
      return;
    }

    if (redirectStatus === "failed" || redirectStatus === "canceled") {
      try {
        const raw = sessionStorage.getItem("pending_stripe_order");
        if (raw) {
          const { uuid, value, currency } = JSON.parse(raw) as {
            uuid: string;
            value: string;
            currency: string;
          };
          handlePaymentFailed({
            error_code:
              redirectStatus === "canceled"
                ? "stripe_redirect_canceled"
                : "stripe_redirect_failed",
            order_value: parseFloat(value || "0"),
            currency: currency || "EUR",
            transaction_id: uuid,
          });
          sessionStorage.removeItem("pending_stripe_order");
        }
      } catch {
        // sessionStorage unavailable or parse error — analytics skipped
      }

      setToastMessage(paymentFailedMessage);
      setOrderModifiedToastOpen(true);

      const timer = window.setTimeout(() => {
        router.replace(pathname);
      }, 400);

      return () => window.clearTimeout(timer);
    }
  }, [
    searchParams,
    pathname,
    router,
    paymentFailedMessage,
    setToastMessage,
    setOrderModifiedToastOpen,
    currentCountry.countryCode,
    languageId,
    handlePaymentFailed,
  ]);
}
