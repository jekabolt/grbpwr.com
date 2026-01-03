"use client";

import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import CartProductsList from "@/app/[locale]/(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "@/app/[locale]/(checkout)/cart/_components/CartTotalPrice";
import { useDataContext } from "@/components/contexts/DataContext";
import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { validateCartItems } from "@/lib/cart/validate-cart-items";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Text } from "./text";
import { SubmissionToaster } from "./toaster";

export function MobileNavCart({
  isProductInfo = false,
}: {
  isProductInfo?: boolean;
}) {
  const router = useRouter();
  const { products, isOpen, openCart, closeCart, syncWithValidatedItems } =
    useCart((state) => state);
  const { currentCountry } = useTranslationsStore((state) => state);
  const { dictionary } = useDataContext();
  const { handleBeginCheckoutEvent } = useCheckoutAnalytics({});

  const t = useTranslations("navigation");
  const tCart = useTranslations("cart");
  const tToaster = useTranslations("toaster");
  const tAccessibility = useTranslations("accessibility");

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const open = isMobile && isOpen;
  const [isValidating, setIsValidating] = useState(false);
  const [orderModifiedToastOpen, setOrderModifiedToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>(
    tToaster("cart_modified"),
  );

  const itemsQuantity = Object.keys(products).length;
  const cartCount = itemsQuantity.toString().padStart(2, "0");

  const handleProceedToCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (products.length === 0) return;

    setIsValidating(true);

    try {
      const currency =
        currentCountry.currencyKey || dictionary?.baseCurrency || "EUR";

      const result = await validateCartItems({
        products,
        currency,
        promoCode: undefined,
        shipmentCarrierId: undefined,
        country: currentCountry?.countryCode,
        paymentMethod: undefined,
      });

      if (!result) {
        setToastMessage(tToaster("cart_outdated"));
        setOrderModifiedToastOpen(true);
        closeCart();
        return;
      }

      const { response, hasItemsChanged } = result;
      const validItems = response.validItems || [];
      const maxOrderItems = dictionary?.maxOrderItems || 3;

      if (validItems.length === 0) {
        syncWithValidatedItems(response, maxOrderItems);
        setToastMessage(tToaster("cart_outdated"));
        setOrderModifiedToastOpen(true);
        closeCart();
        return;
      }

      syncWithValidatedItems(response, maxOrderItems);

      if (hasItemsChanged) {
        setToastMessage(tToaster("cart_modified"));
        setOrderModifiedToastOpen(true);
      }

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
    <>
      <DialogPrimitives.Root open={open} onOpenChange={closeCart}>
        <Button
          size={isProductInfo ? "default" : "lg"}
          onClick={openCart}
          className={cn("w-full bg-transparent text-right", {
            "w-1/3 py-2.5 pr-2.5": isProductInfo,
          })}
        >
          {t("cart")} {itemsQuantity ? itemsQuantity : ""}
        </Button>
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay className="fixed inset-0 z-10 h-screen w-screen bg-overlay" />
          <DialogPrimitives.Content className="fixed inset-x-2.5 bottom-auto top-2 z-50 flex max-h-[calc(100vh-5px)] flex-col overflow-hidden bg-bgColor px-2.5 pb-2.5 pt-4 text-textColor lg:hidden">
            <DialogPrimitives.Title className="sr-only">
              {tAccessibility("mobile menu")}
            </DialogPrimitives.Title>
            <div className="flex h-full min-h-0 flex-col">
              <div
                className={cn(
                  "relative mb-10 flex shrink-0 items-center justify-between",
                  {
                    "mb-0": itemsQuantity === 0,
                  },
                )}
              >
                <Text variant="uppercase">{`${tCart("shopping cart")} ${itemsQuantity ? `[${cartCount}]` : ""}`}</Text>
                <DialogPrimitives.Close asChild>
                  <Button onClick={closeCart} className="-m-2 p-3">
                    [x]
                  </Button>
                </DialogPrimitives.Close>
              </div>
              {itemsQuantity > 0 ? (
                <>
                  <div className="no-scroll-bar min-h-0 flex-1 overflow-y-auto">
                    <CartProductsList />
                  </div>
                  <div className="mt-auto shrink-0 space-y-6 pt-6">
                    <CartTotalPrice />
                    <Button
                      variant="main"
                      size="lg"
                      className="w-full uppercase"
                      onClick={handleProceedToCheckout}
                      disabled={isValidating}
                      loading={isValidating}
                    >
                      {tCart("proceed to checkout")}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex h-[33.333vh] items-center justify-center">
                  <Text variant="uppercase">{tCart("empty")}</Text>
                </div>
              )}
            </div>
          </DialogPrimitives.Content>
        </DialogPrimitives.Portal>
      </DialogPrimitives.Root>
      <SubmissionToaster
        open={orderModifiedToastOpen}
        message={toastMessage}
        onOpenChange={setOrderModifiedToastOpen}
      />
    </>
  );
}
