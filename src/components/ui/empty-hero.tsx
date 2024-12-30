import Link from "next/link";

import { Button } from "./button";

export function EmptyHero() {
  return (
    <div className="bg-bgBlack h-screen w-full">
      <div className="bg-bgBlack absolute inset-0 flex h-screen items-center justify-center">
        <Button variant="underline" className="uppercase text-white" asChild>
          <Link href="/catalog">shop now</Link>
        </Button>
      </div>
    </div>
  );
}
