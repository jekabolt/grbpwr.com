import type {
  GetArchivesPagedRequest,
  GetProductsPagedRequest,
} from "@/api/proto-http/frontend";
import { QueryWrapper } from "@/providers/query-wrapper";

import { DataContextProvider } from "@/components/contexts/DataContext";
import { ServerActionsContextProvider } from "@/components/contexts/ServerActionsContext";
import { serviceClient } from "@/lib/api";
import { CartStoreProvider } from "@/lib/stores/cart/store-provider";
import { CheckoutStoreProvider } from "@/lib/stores/checkout/store-provider";
import { LastViewedStoreProvider } from "@/lib/stores/last-viewed/store-provider.";
import { getInitialTranslationState } from "@/lib/stores/translations/cookie-utils";
import { TranslationsStoreProvider } from "@/lib/stores/translations/store-provider";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch data in parallel for better performance
  const [heroData, initialTranslationState] = await Promise.all([
    serviceClient.GetHero({}),
    getInitialTranslationState(),
  ]);

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
                initialRates={heroData.rates?.currencies}
              >
                <DataContextProvider {...heroData}>
                  {children}
                </DataContextProvider>
              </TranslationsStoreProvider>
            </LastViewedStoreProvider>
          </CheckoutStoreProvider>
        </CartStoreProvider>
      </ServerActionsContextProvider>
    </QueryWrapper>
  );
}
