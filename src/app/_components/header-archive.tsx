"use client";

import Link from "next/link";

import { HeaderProps } from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";

export function HeaderArchive({ left, center, right, onClick }: HeaderProps) {
  return (
    <header className="fixed left-2 right-2 top-2 z-30 flex h-12 items-center gap-2 bg-bgColor p-3 py-2 text-textColor lg:mx-2 lg:px-5 lg:py-3">
      <Button asChild>
        <Link href="/">{left}</Link>
      </Button>
      <Button className="grow basis-0 text-start">{center}</Button>
      <Button onClick={onClick}>{right}</Button>
    </header>
  );
}
