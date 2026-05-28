"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { useTranslations } from "next-intl";

import { CartStoreContext, useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import { AccountCartMobileOrderSummary } from "../../account/authorization/account-cart-mobile-order-summary";
import { clearAccountLoginPersistence } from "../../account/utils/use-account-login";

const DISPLAY_MS = 3_000;

export function MagicLoginSuccessClient() {
  const router = useRouter();
  const tAccount = useTranslations("account");
  const tNav = useTranslations("navigation");
  const { currentCountry, languageId } = useTranslationsStore((s) => s);
  const cartStore = useContext(CartStoreContext);
  const [cartHydrated, setCartHydrated] = useState(() =>
    cartStore ? cartStore.persist.hasHydrated() : false,
  );

  useEffect(() => {
    if (!cartStore) return;
    if (cartStore.persist.hasHydrated()) {
      setCartHydrated(true);
      return;
    }
    return cartStore.persist.onFinishHydration(() => setCartHydrated(true));
  }, [cartStore]);
  const products = useCart((s) => s.products);
  const hasCartItems = useMemo(() => products.length > 0, [products]);

  const localizedPaths = useMemo(() => {
    const country = currentCountry.countryCode?.toLowerCase() || "gb";
    const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
    return {
      checkout: `/${country}/${locale}/checkout`,
      account: `/${country}/${locale}/account`,
    };
  }, [currentCountry.countryCode, languageId]);

  useEffect(() => {
    clearAccountLoginPersistence();
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;

    const destination = hasCartItems
      ? localizedPaths.checkout
      : localizedPaths.account;

    const id = window.setTimeout(() => {
      router.replace(destination);
    }, DISPLAY_MS);

    return () => window.clearTimeout(id);
  }, [cartHydrated, hasCartItems, localizedPaths, router]);

  const useCheckoutHeader = cartHydrated && hasCartItems;

  return (
    <FlexibleLayout
      headerType={useCheckoutHeader ? "flexible" : "main"}
      displayFooter={false}
      headerProps={{
        left: "<",
        center: tNav("checkout"),
        right: tNav("close"),
      }}
    >
      <div className="flex min-h-dvh flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <Text variant="uppercase">
            {tAccount("magic_login_success_title")}
          </Text>
          <Text>{tAccount("magic_login_success_subtitle")}</Text>
        </div>
      </div>

      {hasCartItems && (
        <div className="fixed inset-x-2.5 bottom-6 z-40">
          <AccountCartMobileOrderSummary />
        </div>
      )}
    </FlexibleLayout>
  );
}
