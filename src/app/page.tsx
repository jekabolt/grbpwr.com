import { serviceClient } from "@/lib/api";
import NavigationLayout from "@/components/navigation-layout";
import { Ads } from "@/app/_components/ads";

import { MainAds } from "./_components/main-ads";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  return (
    <>
      <NavigationLayout>
        <MainAds main={hero?.entities?.[0]?.main} />
        <Ads entities={hero?.entities || []} />
        {/* <Button asChild size="giant" variant="simple">
          <Link href="/catalog">view all</Link>
        </Button> */}
      </NavigationLayout>
    </>
  );
}
