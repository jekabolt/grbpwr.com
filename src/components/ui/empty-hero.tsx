import Link from "next/link";

import FlexibleLayout from "../flexible-layout";
import { Button } from "./button";

export function EmptyHero() {
  return (
    <FlexibleLayout theme="dark">
      <div className="blackTheme absolute inset-0 flex h-screen w-full items-center justify-center bg-bgColor text-textColor">
        <Button variant="underline" className="uppercase" asChild>
          <Link href="/catalog">shop now</Link>
        </Button>
      </div>
    </FlexibleLayout>
  );
}
