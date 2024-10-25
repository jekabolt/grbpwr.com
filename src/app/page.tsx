import Link from "next/link";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import { Ads } from "@/features/hero/ads";
import { MainAds } from "@/features/hero/main";
import { Button } from "@/components/ui/button";
import { serviceClient } from "@/lib/api";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  return (
    <>
      <MainAds main={hero?.entities?.[0].mainAdd} />
      <NavigationLayout>
        <Ads entities={hero?.entities || []} />
        <Button asChild size="giant" variant="simple">
          <Link href="/catalog">view all</Link>
        </Button>
      </NavigationLayout>
    </>
  );
}
