import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AdditionalHeader({
  left,
  center,
  right,
  link,
}: {
  left?: string;
  link?: string;
  center?: string;
  right?: string;
}) {
  return (
    <header className="text fixed left-2 right-2 top-2 z-30 flex h-12 items-center justify-between bg-bgColor p-3 py-2 text-textColor lg:mx-2 lg:px-5 lg:py-3">
      <Button asChild size="sm">
        <Link href={`/${link}`}>{left}</Link>
      </Button>
      <div className="flex-none text-center text-textSmallSize">{center}</div>
      <Button asChild size="sm" className="hidden lg:block">
        <Link href="/">{right}</Link>
      </Button>
      <Button asChild size="sm" className="block lg:hidden">
        <Link href="/">[x]</Link>
      </Button>
    </header>
  );
}
