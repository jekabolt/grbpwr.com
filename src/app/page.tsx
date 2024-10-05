import CoreLayout from "@/components/layouts/CoreLayout";
import HeroAds from "@/components/sections/HeroSection/Ads";
import HeroMain from "@/components/sections/HeroSection/Main";
import ProductsSection from "@/components/sections/ProductsGridSection";
import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";
import { serviceClient } from "@/lib/api";
import Link from "next/link";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  //if (!hero?.entities || hero?.entities?.length === 0) return notFound();

  return (
    <>
      <HeroMain main={hero?.entities?.[0].mainAdd} />
      <CoreLayout>
        {hero?.entities?.map((e) => {
          switch (e.type) {
            case "HERO_TYPE_SINGLE_ADD":
              return <HeroAds singleAd={e.singleAdd}></HeroAds>;
            case "HERO_TYPE_DOUBLE_ADD":
              return <HeroAds doubleAd={e.doubleAdd}></HeroAds>;
            case "HERO_TYPE_FEATURED_PRODUCTS":
              return (
                <ProductsSection products={e.featuredProducts?.products} />
              );
            default:
              return null;
          }
        })}
        <Button asChild style={ButtonStyle.bigButton}>
          <Link href="/catalog">view all</Link>
        </Button>
      </CoreLayout>
    </>
  );
}
