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
        <div className="justify-center bg-black px-8 py-6 text-[232px] font-medium lowercase leading-[208.8px] text-white max-md:max-w-full max-md:px-5 max-md:text-4xl">
          VIEW ALL
        </div>
        <ProductsSection products={productsFeatured} />
      </CoreLayout>
    </>
  );
}
