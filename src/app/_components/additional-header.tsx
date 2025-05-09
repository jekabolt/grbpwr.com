import Link from "next/link";

import { cn } from "@/lib/utils";
import { HeaderProps } from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";

export function AdditionalHeader({
  left,
  center,
  right,
  link,
  hidden = false,
}: HeaderProps) {
  return (
    <header className="text fixed left-2 right-2 top-2 z-30 flex h-12 items-center justify-between bg-bgColor p-3 py-2 text-textColor lg:mx-2 lg:px-5 lg:py-3">
      <Button asChild size="sm">
        <Link href={`/${link}`}>{left}</Link>
      </Button>
      <div className="flex-none text-center text-textBaseSize">{center}</div>
      <Button asChild size="sm" className="hidden lg:block">
        <Link href="/">{right}</Link>
      </Button>
      <Button
        asChild
        size="sm"
        className={cn("block lg:hidden", {
          hidden: hidden,
        })}
      >
        <Link href="/">[x]</Link>
      </Button>
    </header>
  );
}
