import Link from "next/link";

import { HeaderProps } from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { MobileArchiveHeader } from "./mobile-archive-header";

export function HeaderArchive({
  left,
  center,
  right,
  link,
  onClick,
}: HeaderProps) {
  return (
    <>
      <div className="block lg:hidden">
        <MobileArchiveHeader
          left={left}
          center={center}
          right={right}
          onClick={onClick}
        />
      </div>
      <header className="fixed inset-x-2.5 bottom-2 z-30 hidden h-12 items-center justify-between gap-1 border-textInactiveColor bg-transparent p-3 text-textColor mix-blend-exclusion lg:top-2 lg:flex lg:gap-0 lg:border-0 lg:px-5 lg:py-3">
        <div className="flex gap-3">
          <Button asChild>
            <Link href={link ? link : "/"}>{left}</Link>
          </Button>
          <Text className="flex grow basis-0 text-left">{center}</Text>
        </div>
        <Button onClick={onClick}>{right}</Button>
      </header>
    </>
  );
}
