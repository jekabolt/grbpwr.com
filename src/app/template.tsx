import type {
  GetArchivesPagedRequest,
  GetHeroResponse,
  GetProductsPagedRequest,
} from "@/api/proto-http/frontend";
import type { CurrencyRate } from "@/lib/stores/translations/store-types";
import { QueryWrapper } from "@/providers/query-wrapper";

import { serviceClient } from "@/lib/api";
import { CartStoreProvider } from "@/lib/stores/cart/store-provider";
import { CartCurrencySyncWrapper } from "@/lib/stores/cart/cart-currency-sync-wrapper";
import { CheckoutStoreProvider } from "@/lib/stores/checkout/store-provider";
import { LastViewedStoreProvider } from "@/lib/stores/last-viewed/store-provider.";
import { getInitialTranslationState } from "@/lib/stores/translations/cookie-utils";
import { TranslationsStoreProvider } from "@/lib/stores/translations/store-provider";
import { DataContextProvider } from "@/components/contexts/DataContext";
import { ServerActionsContextProvider } from "@/components/contexts/ServerActionsContext";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const heroData = await serviceClient.GetHero({});
  const initialTranslationState = await getInitialTranslationState();

  return (
    <QueryWrapper>
      <ServerActionsContextProvider
        // all requests on the client should be made using server actions accessible from the context
        GetArchivesPaged={async (request: GetArchivesPagedRequest) => {
          "use server";
          return serviceClient.GetArchivesPaged(request);
        }}
        GetProductsPaged={async (request: GetProductsPagedRequest) => {
          "use server";
          return serviceClient.GetProductsPaged(request);
        }}
      >
        <CartStoreProvider>
          <CheckoutStoreProvider>
            <LastViewedStoreProvider>
              <TranslationsStoreProvider
                initialCountry={initialTranslationState.country}
                initialLanguageId={initialTranslationState.languageId}
                initialRates={((heroData as GetHeroResponse & { rates?: { currencies?: Record<string, CurrencyRate> } }).rates?.currencies) as Record<string, CurrencyRate> | undefined}
              >
                <CartCurrencySyncWrapper>
                  <DataContextProvider {...heroData}>
                    {children}
                  </DataContextProvider>
                </CartCurrencySyncWrapper>
              </TranslationsStoreProvider>
            </LastViewedStoreProvider>
          </CheckoutStoreProvider>
        </CartStoreProvider>
      </ServerActionsContextProvider>
    </QueryWrapper>
  );
}
