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
    <header
      className={cn(
        "fixed inset-x-2.5 top-2 z-30 h-12 py-2 lg:gap-0 lg:px-5 lg:py-3",
        "flex items-center justify-between gap-1",
        "blackTheme bg-transparent text-textColor mix-blend-exclusion",
      )}
    >
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
