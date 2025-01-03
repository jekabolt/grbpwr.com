import { serviceClient } from "@/lib/api";
import NavigationLayout from "@/components/navigation-layout";
import { EmptyHero } from "@/components/ui/empty-hero";
import { Ads } from "@/app/_components/ads";

import { MainAds } from "./_components/main-ads";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});
  if (!hero?.entities?.length) return <EmptyHero />;

  return (
    <>
      <NavigationLayout>
        <MainAds main={hero?.entities?.[0]?.main} />
        <Ads entities={hero?.entities || []} />
      </NavigationLayout>
    </>
  );
}
