import HeroSection from "@/components/sections/HeroSection";
import AdsSection from "@/components/sections/AdsSection";
import ProductsSection from "@/components/sections/ProductsSection";
import { serviceClient } from "@/lib/api";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  if (!hero) return "no hero data";

  const { main, ads, productsFeatured } = hero;

  // console.log("productsFeatured");
  // console.log(productsFeatured);

  return (
    <main className="space-y-24">
      <HeroSection {...main} />
      <AdsSection ads={ads} />
      <ProductsSection products={productsFeatured} />
    </main>
  );
}
