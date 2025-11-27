"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { validateCartItems } from "@/lib/cart/validate-cart-items";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

export default function CartPopup({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { products, isOpen, closeCart, syncWithValidatedItems } = useCart(
    (state) => state,
  );
  const { selectedCurrency } = useCurrency((state) => state);
  const { currentCountry } = useTranslationsStore((state) => state);
  const { dictionary } = useDataContext();
  const { handleBeginCheckoutEvent } = useCheckoutAnalytics({});

  const [isValidating, setIsValidating] = useState(false);
  const [orderModifiedToastOpen, setOrderModifiedToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>(
    "you cart has been modified",
  );

  const itemsQuantity = products.length;
  const cartCount = itemsQuantity.toString().padStart(2, "0");
  const t = useTranslations("cart");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  const handleProceedToCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (products.length === 0) return;

    setIsValidating(true);

    try {
      const currency = selectedCurrency || dictionary?.baseCurrency || "EUR";

      const result = await validateCartItems({
        products,
        currency,
        promoCode: undefined,
        shipmentCarrierId: undefined,
        country: currentCountry?.countryCode,
        paymentMethod: undefined,
      });

      if (!result) {
        setToastMessage("your cart is outaded");
        setOrderModifiedToastOpen(true);
        closeCart();
        return;
      }

      const { response, hasItemsChanged } = result;
      const validItems = response.validItems || [];

      // No valid items left after validation: clear/sync cart, show toast, close popup, don't navigate
      if (validItems.length === 0) {
        syncWithValidatedItems(response);
        setToastMessage("your cart is outaded");
        setOrderModifiedToastOpen(true);
        closeCart();
        return;
      }

      // We have some valid items; sync cart and optionally show "modified" toast
      syncWithValidatedItems(response);

      if (hasItemsChanged) {
        setToastMessage("you cart has been modified");
        setOrderModifiedToastOpen(true);
      }

      // Navigate to checkout when there are still valid items
      if (validItems.length > 0) {
        handleBeginCheckoutEvent();
        router.push("/checkout");
      }
    } catch (error) {
      console.error("Failed to validate items before checkout:", error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="z-50 w-full">
      {isOpen && (
        <Overlay
          cover="screen"
          onClick={closeCart}
          disablePointerEvents={false}
        />
      )}
      <div className="hidden lg:block">
        {isOpen && (
          <div className="blackTheme fixed right-0 top-0 z-30 h-screen w-[500px] bg-bgColor p-2.5 text-textColor">
            <div className="flex h-full flex-col gap-y-6">
              <div className="flex items-center justify-between">
                <Text variant="uppercase">{`${t("shopping cart")} ${itemsQuantity ? `[${cartCount}]` : ""}`}</Text>
                <Button onClick={closeCart}>[x]</Button>
              </div>
              {!itemsQuantity ? (
                <div className="flex h-full items-center justify-center">
                  <Text>{t("empty")}</Text>
                </div>
              ) : (
                <>{children}</>
              )}
              {itemsQuantity > 0 && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="block w-full uppercase"
                  onClick={handleProceedToCheckout}
                  disabled={isValidating}
                  loading={isValidating}
                >
                  {t("proceed to checkout")}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <SubmissionToaster
        open={orderModifiedToastOpen}
        message={toastMessage}
        onOpenChange={setOrderModifiedToastOpen}
      />
    </div>
  );
}
