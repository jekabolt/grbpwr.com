import Link from "next/link";

import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Ads } from "@/app/_components/ads";
import { MainAds } from "@/app/_components/main-ads";
import NavigationLayout from "@/app/_components/navigation-layout";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  return (
    <>
      <MainAds main={hero?.entities?.[0]?.mainAdd} />
      <NavigationLayout>
        <Ads entities={hero?.entities || []} />
        <Button asChild size="giant" variant="simple">
          <Link href="/catalog">view all</Link>
        </Button>
      </NavigationLayout>
    </>
  );
}
