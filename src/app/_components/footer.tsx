"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FOOTER_YEAR, FOOTER_LINKS as links } from "@/constants";

import { Button } from "@/components/ui/button";
import { WhiteLogo } from "@/components/ui/icons/white-logo";
import { Text } from "@/components/ui/text";

import CurrencyPopover from "./currency-popover";
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

  return timestamp ? `${timestamp}` : "";
}

export function Footer() {
  return (
    <footer className="flex w-full flex-col space-y-10 px-2.5 pb-16 pt-8 lg:pb-2.5">
      <div className="flex flex-col space-y-9 lg:flex-row">
        <div className="aspect-square w-full self-center lg:w-1/2 lg:border-r lg:border-textColor">
          <WhiteLogo className="mx-auto w-full lg:w-1/2" />
        </div>
        <div className="flex flex-col items-center justify-center gap-y-9 lg:mx-auto lg:w-2/5 lg:gap-y-32">
          <div className="order-1 w-full lg:order-2">
            <NewslatterForm view="footer" />
          </div>
          <div className="order-2 flex w-full flex-col space-y-9 lg:order-1 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <Text className="uppercase text-highlightColor">
              client service
            </Text>
            <Text className="uppercase text-highlightColor">order status</Text>
            <Button asChild className="uppercase text-highlightColor">
              <Link href="/legal-notices">legal notices</Link>
            </Button>
            <div className="w-full lg:hidden">
              <CurrencyPopover align="start" title="Currency:" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-9 lg:flex-row lg:items-center lg:justify-between">
        <div className="order-1 flex items-center justify-between lg:order-2 lg:w-1/2">
          {links.map((link) => (
            <Button
              asChild
              key={link.text}
              className="uppercase text-highlightColor"
            >
              <Link href={link.href}>{link.text}</Link>
            </Button>
          ))}
        </div>
        <div className="order-2 flex items-center justify-between lg:order-1 lg:w-1/2 lg:justify-start lg:gap-x-2">
          <Text variant="uppercase">grbpwr</Text>
          <Text>
            <LiveClock />
          </Text>
          <div className="hidden lg:block">
            <CurrencyPopover align="start" title="currency:" />
          </div>
        </div>
      </div>
    </footer>
  );
}
