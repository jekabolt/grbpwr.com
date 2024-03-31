import Image from "next/image";

import { serviceClient } from "@/lib/api";

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});

  if (!hero) return "no hero data";

  const { id, createdAt, main, ads } = hero;

  return (
    <main className="p-2">
      <div>
        <span className="text-xl font-bold">
          revalidate time: <span className="text-orange-400">15 seconds</span>
        </span>{" "}
        {`id: ${id} createdAt: ${createdAt}`}
      </div>
      <div className="flex flex-col gap-10 md:flex-row">
        <div>
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
        <div className="space-y-10">
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
      </div>
    </main>
  );
}
