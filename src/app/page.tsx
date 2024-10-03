import CoreLayout from "@/components/layouts/CoreLayout";
import AdsSection from "@/components/sections/AdsSection";
import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsGridSection";
import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";
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
      <CoreLayout>
        <h1 className="font0-bold my-10 text-9xl">rework</h1>
        {/* <AdsSection ads={ads} /> */}
        <Button asChild style={ButtonStyle.bigButton}>
          <Link href="/catalog">view all</Link>
        </Button>
        {/* <ProductsSection products={hero.productsFeatured} /> */}
      </CoreLayout>
    </>
  );
}
