import Link from "next/link";

import { serviceClient } from "@/lib/api";

export default async function Page() {
  const hero = await serviceClient.GetHero({});

  console.log("hero request");
  console.log(hero);

  return (
    <main>
      <Link href="/catalog" className="hover:underline">
        Catalog
      </Link>
      <h1 className="text-[200px]">Home</h1>
    </main>
  );
}
