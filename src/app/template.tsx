import { GetArchivesPagedRequest } from "@/api/proto-http/frontend";
import { QueryWrapper } from "@/providers/query-wrapper";

import { serviceClient } from "@/lib/api";
import { CartStoreProvider } from "@/lib/stores/cart/store-provider";
import { CurrencyStoreProvider } from "@/lib/stores/currency/store-provider";
import { LastViewedStoreProvider } from "@/lib/stores/last-viewed/store-provider.";
import { DataContextProvider } from "@/components/contexts/DataContext";
import { ServerActionsContextProvider } from "@/components/contexts/ServerActionsContext";

export const dynamic = "force-static";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const heroData = await serviceClient.GetHero({});

  return (
    <QueryWrapper>
      <ServerActionsContextProvider
        // all requests on the client should be made using server actions accessible from the context
        GetArchivesPaged={async (request: GetArchivesPagedRequest) => {
          "use server";
          return serviceClient.GetArchivesPaged(request);
        }}
      >
        <CartStoreProvider>
          <LastViewedStoreProvider>
            <CurrencyStoreProvider rates={heroData.rates?.currencies || {}}>
              <DataContextProvider {...heroData}>
                {children}
              </DataContextProvider>
            </CurrencyStoreProvider>
          </LastViewedStoreProvider>
        </CartStoreProvider>
      </ServerActionsContextProvider>
    </QueryWrapper>
  );
}
