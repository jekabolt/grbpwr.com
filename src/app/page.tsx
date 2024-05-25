import { notFound } from "next/navigation";
import CoreLayout from "@/components/layouts/CoreLayout";
import AdsSection from "@/components/sections/AdsSection";
import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsGridSection";
import { serviceClient } from "@/lib/api";
import Link from "@/components/global/Link";
import { LinkStyle } from "@/components/global/Link/styles";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  if (!hero) return notFound();

  const { main, ads, productsFeatured } = hero;

  return (
    <>
      <HeroSection {...main} />
      <CoreLayout>
        <AdsSection ads={ads} />
        <Link style={LinkStyle.bigButton} href="/catalog" title="view all" />
        <ProductsSection products={productsFeatured} />
      </CoreLayout>
    </>
  );
}
