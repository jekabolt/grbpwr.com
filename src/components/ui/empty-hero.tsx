import Link from "next/link";

import { Button } from "./button";

export function EmptyHero() {
  return (
    <div className="blackTheme h-screen w-full bg-bgColor">
      <div className="absolute inset-0 flex h-screen items-center justify-center">
        <Button variant="underline" className="uppercase" asChild>
          <Link href="/catalog">shop now</Link>
        </Button>
      </div>
    </div>
  );
}
