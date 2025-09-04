import Link from "next/link";

import { Button } from "./button";

export function EmptyHero() {
  return (
    <div className="h-screen w-full bg-bgColor text-textColor">
      <div className="absolute inset-0 flex h-screen items-center justify-center text-textColor">
        <Button variant="underline" className="uppercase" asChild>
          <Link href="/catalog">shop now</Link>
        </Button>
      </div>
    </div>
  );
}
