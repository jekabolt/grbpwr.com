import { serviceClient } from "@/lib/api";
import { CartStoreProvider } from "@/lib/stores/cart/store-provider";
import { CurrencyStoreProvider } from "@/lib/stores/currency/store-provider";
import { DataContextProvider } from "@/components/DataContext";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const heroData = await serviceClient.GetHero({});

  return (
    <CartStoreProvider>
      <CurrencyStoreProvider
        baseCurrency={heroData.dictionary?.baseCurrency || ""}
        rates={heroData.rates?.currencies || {}}
      >
        <DataContextProvider {...heroData}>{children}</DataContextProvider>
      </CurrencyStoreProvider>
    </CartStoreProvider>
  );
}
