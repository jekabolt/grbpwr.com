"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { useTranslations } from "next-intl";

import {
  invalidateAccountSessionCache,
  resolveAccountSession,
  storefrontAccountToProfile,
} from "@/lib/storefront-account/client-session";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { CartStoreContext, useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import FlexibleLayout from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { AccountCartMobileOrderSummary } from "../../account/authorization/account-cart-mobile-order-summary";
import { clearAccountLoginPersistence } from "../../account/utils/use-account-login";

const DISPLAY_MS = 3_000;

export function MagicLoginSuccessClient() {
  const router = useRouter();
  const tAccount = useTranslations("account");
  const tNav = useTranslations("navigation");
  const setSignedIn = useAccountOnboardingStore((s) => s.setSignedIn);
  const setAccount = useAccountOnboardingStore((s) => s.setAccount);
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
    invalidateAccountSessionCache();
    void resolveAccountSession().then((account) => {
      if (!account) return;
      setSignedIn(true);
      setAccount(storefrontAccountToProfile(account));
    });
    router.refresh();
  }, [router, setAccount, setSignedIn]);

  const destination = hasCartItems
    ? localizedPaths.checkout
    : localizedPaths.account;

  useEffect(() => {
    const id = window.setTimeout(() => {
      router.replace(destination);
    }, DISPLAY_MS);

    return () => window.clearTimeout(id);
  }, [destination, router]);

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
        <div
          role="status"
          aria-live="polite"
          className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center"
        >
          <Text variant="uppercase" component="h1">
            {tAccount("magic_login_success_title")}
          </Text>
          <Text>{tAccount("magic_login_success_subtitle")}</Text>
          <Button
            asChild
            variant="underline"
            className="mt-4 inline-flex min-h-[44px] items-center uppercase"
          >
            <Link href={destination} replace>
              {tAccount("continue")}
            </Link>
          </Button>
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
