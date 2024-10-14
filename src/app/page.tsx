import NavigationLayout from "@/components/layouts/NavigationLayout";
import AdsSection from "@/components/sections/AdsSection";
import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsGridSection";
import { Button } from "@/components/ui/Button";
import { serviceClient } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  if (!hero) return notFound();

  // const main = hero?.ads?.find((x) => x.isMain);

  // const ads = hero.ads?.filter((x) => !x.isMain);

  return (
    <>
      {/* {main && <HeroSection {...main} />} */}
      <NavigationLayout>
        <h1 className="font0-bold my-10 text-9xl">rework</h1>
        {/* <AdsSection ads={ads} /> */}
        <Button asChild size="giant" variant="simple">
          <Link href="/catalog">wdview all</Link>
        </Button>
        {/* <ProductsSection products={hero.productsFeatured} /> */}
      </NavigationLayout>
    </>
  );
}
