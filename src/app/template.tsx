import { serviceClient } from "@/lib/api";
import { CartStoreProvider } from "@/lib/stores/cart/store-provider";
import { DataContextProvider } from "@/components/DataContext";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const heroData = await serviceClient.GetHero({});

  return (
    <CartStoreProvider>
      <DataContextProvider {...heroData}>{children}</DataContextProvider>
    </CartStoreProvider>
  );
}
