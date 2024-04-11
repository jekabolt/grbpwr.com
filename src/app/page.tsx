import Image from "next/image";

import { serviceClient } from "@/lib/api";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  if (!hero) return "no hero data";

  const { id, createdAt, main, ads, productsFeatured } = hero;

  return (
    <main className="p-2">
      <div>
        <span className="font-bold">
          revalidate time: <span className="text-orange-400">15 seconds</span>
        </span>{" "}
        {`id: ${id} createdAt: ${createdAt}`}
      </div>
      <div className="flex flex-col gap-10">
        <div className="mx-auto">
          <span className="text-2xl font-bold">hero.main</span>
          <div className="space-y-2">
            <Image
              src={main?.contentLink || ""}
              alt="main hero image"
              height={500}
              width={500}
            />
            {main &&
              Object.entries(main).map(
                ([key, value]) =>
                  key !== "contentLink" && (
                    <p key={key}>
                      <span className="font-bold">{key}</span>: {value}
                    </p>
                  ),
              )}
          </div>
        </div>
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
      </div>
    </main>
  );
}
