"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { useClickAway } from "@uidotdev/usehooks";

import { Button } from "@/components/ui/button";

export default function useMovileMenu() {
  const [isOpen, setOpenStatus] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => {
    setOpenStatus(false);
  });

  return {
    triggerElement: <MobileMenuTrigger setOpenStatus={setOpenStatus} />,
    dropdownElement: isOpen ? (
      <div ref={ref}>
        <MobileMenuDropdown setOpenStatus={setOpenStatus} />
      </div>
    ) : null,
  };
}

function MobileMenuTrigger({
  setOpenStatus,
}: {
  setOpenStatus: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Button
      size="sm"
      variant="underlineWithColors"
      onClick={() => setOpenStatus(true)}
    >
      menu
    </Button>
  );
}

function MobileMenuDropdown({
  setOpenStatus,
}: {
  setOpenStatus: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="absolute left-0 top-[72px] w-full border-t border-gray-300 bg-bgColor p-3 pb-5 text-textColor">
      <button
        className="absolute right-3 top-3"
        onClick={() => setOpenStatus(false)}
      >
        {"[x]"}
      </button>
      <nav className="space-y-6">
        <Button asChild variant="underlineWithColors">
          <Link href="/catalog">catalog</Link>
        </Button>
        <Button asChild variant="underlineWithColors">
          <Link href="/archive">archive</Link>
        </Button>
        <Button asChild variant="underlineWithColors">
          <Link href="/about">about</Link>
        </Button>
        <Button asChild variant="underlineWithColors">
          <Link href="/shipping">shipping</Link>
        </Button>
        <Button asChild variant="underlineWithColors">
          <Link href="/contacts">contacts</Link>
        </Button>
      </nav>
    </div>
  );
}
