"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FOOTER_LINKS as links } from "@/constants";

import { Button } from "@/components/ui/button";
import { WhiteLogo } from "@/components/ui/icons/white-logo";
import { Text } from "@/components/ui/text";

import CurrencyPopover from "./currency-popover";
import NewslatterForm from "./newslatter-form";

function LiveClock() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return `${timestamp}`;
}

export function Footer({
  className,
  hideForm,
}: {
  className?: string;
  hideForm?: boolean;
}) {
  return (
    <footer className="flex w-full flex-col space-y-10 px-2.5 pb-16 pt-8">
      <div className="aspect-square w-full self-center">
        <WhiteLogo />
      </div>
      <NewslatterForm view="footer" />
      <div className="space-y-9">
        <Text className="uppercase text-highlightColor">client service</Text>
        <Text className="uppercase text-highlightColor">order status</Text>
        <Text className="uppercase text-highlightColor">legal notices</Text>
        <div className="w-full">
          <CurrencyPopover align="start" title="Currency:" />
        </div>
      </div>
      <div className="flex items-center justify-between">
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
      <div className="flex items-center justify-between">
        <Text variant="uppercase">grbpwr</Text>
        <Text>
          <LiveClock />
        </Text>
      </div>
    </footer>
  );
}
