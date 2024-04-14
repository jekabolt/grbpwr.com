import Image from "next/image";

import Hero from "@/components/sections/Hero";

import { serviceClient } from "@/lib/api";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  if (!hero) return "no hero data";

  const { main, ads, productsFeatured } = hero;

  return (
    <main className="px-5 py-3">
      <Hero {...main} />
      <div className="mx-auto space-y-10">
        <span className="text-2xl font-bold">hero.ads</span>
        {ads &&
          ads.map((ad, i) => (
            <div key={i} className="space-y-2">
              <Image
                src={ad?.contentLink || ""}
                alt="ad hero image"
                height={200}
                width={200}
              />
              {ad &&
                Object.entries(ad).map(
                  ([key, value]) =>
                    key !== "contentLink" && (
                      <p key={key}>
                        <span className="font-bold">{key}</span>: {value}
                      </p>
                    ),
                )}
            </div>
          ))}
      </div>
      <div className="mx-auto space-y-10">
        <span className="text-2xl font-bold">hero.productsFeatured</span>
        {productsFeatured &&
          productsFeatured.map((product, i) => (
            <div key={i} className="space-y-2">
              <Image
                src={product?.productInsert?.thumbnail || ""}
                alt="ad hero image"
                height={200}
                width={200}
              />
              {product.productInsert &&
                Object.entries(product.productInsert).map(
                  ([key, value]) =>
                    key !== "contentLink" && (
                      <p key={key}>
                        <span className="font-bold">{key}</span>:{" "}
                        {typeof value === "string"
                          ? value
                          : JSON.stringify(value)}
                      </p>
                    ),
                )}
            </div>
          ))}
      </div>
    </main>
  );
}
