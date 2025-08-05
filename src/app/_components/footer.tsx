"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FOOTER_YEAR, FOOTER_LINKS as links } from "@/constants";

import { Button } from "@/components/ui/button";
import { WhiteLogo } from "@/components/ui/icons/white-logo";
import { Text } from "@/components/ui/text";

import CurrencyPopover from "./currency-popover";
import HelpPopover from "./help-popover";
import NewslatterForm from "./newslatter-form";

function LiveClock() {
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    setTimestamp(FOOTER_YEAR);

    const interval = setInterval(() => {
      setTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timestamp ? (
    <Text variant="uppercase" className="text-textColor">
      {timestamp}
    </Text>
  ) : (
    ""
  );
}

export function Footer() {
  return (
    <footer className="flex w-full flex-col">
      <div className="flex flex-col lg:flex-row lg:gap-x-20 lg:gap-y-16 lg:py-52">
        <div className="flex w-full justify-end">
          <WhiteLogo className="aspect-square w-40" />
        </div>
        <div className="flex w-full">
          <NewslatterForm />
        </div>
      </div>
      <div className="flex w-full justify-between gap-x-20 lg:px-7 lg:pb-10">
        <div className="flex gap-x-2">
          <Text variant="uppercase">grbpwr</Text>
          <LiveClock />
        </div>
        <div className="flex w-full justify-between">
          {links.map((l) => (
            <Button
              asChild
              key={l.text}
              className="uppercase text-highlightColor"
            >
              <Link href={l.href}>{l.text}</Link>
            </Button>
          ))}
        </div>
        <div className="flex w-full justify-between">
          <HelpPopover />
          <Button variant="underlineWithColors" className="uppercase" asChild>
            <Link href="/legal-notices">legal notices</Link>
          </Button>
          <Button variant="underlineWithColors" className="uppercase" asChild>
            <Link href="/order-status">order status</Link>
          </Button>
        </div>
        <div className="flex justify-end whitespace-nowrap">
          <CurrencyPopover align="start" title="Currency:" />
        </div>
      </div>
    </footer>
  );
}
