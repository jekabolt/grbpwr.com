import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";
import CoreLayout from "@/components/layouts/CoreLayout";
import AdsSection from "@/components/sections/AdsSection";
import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsGridSection";
import { serviceClient } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  if (!hero) return notFound();

  const { productsFeatured, ads } = hero;

  return (
    <>
      {/* ads */}
      {/* {rest?.main && <HeroSection {...main} />} */}
      <CoreLayout>
        <AdsSection ads={ads} />
        <Button asChild style={ButtonStyle.bigButton}>
          <Link href="/catalog">view all</Link>
        </Button>
        <ProductsSection products={productsFeatured} />
      </CoreLayout>
    </>
  );
}
