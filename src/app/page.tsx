import CoreLayout from "@/components/layouts/CoreLayout";
import AdsSection from "@/components/sections/AdsSection";
import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsGridSection";
import { serviceClient } from "@/lib/api";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  if (!hero) return "no hero data";

  const { main, ads, productsFeatured } = hero;

  return (
    <>
      <HeroSection {...main} />
      <CoreLayout>
        <AdsSection ads={ads} />
        <ProductsSection products={productsFeatured} />
      </CoreLayout>
    </>
  );
}
