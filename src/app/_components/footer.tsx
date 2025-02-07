import Link from "next/link";
import { FOOTER_LINKS as links } from "@/constants";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WhiteLogo } from "@/components/ui/icons/white-logo";
import { Text } from "@/components/ui/text";

import CurrencyPopover from "./currency-popover";
import { FooterNav } from "./footer-nav";
import NewslatterForm from "./newslatter-form";

// todo: sync with BE
const currencyNameMap = {
  t: "ethereum",
  b: "bitcoin",
  e: "euro",
  "0": "united states dollar",
  ":": "united states dollar",
  $: "united states dollar",
  "%": "united states dollar",
  "&": "united states dollar",
  "*": "united states dollar",
  ")": "united states dollar",
  "[": "united states dollar",
  "]": "united states dollar",
  "@": "united states dollar",
};

const currentYear = () => new Date().getFullYear();

export function Footer({
  className,
  hideForm,
}: {
  className?: string;
  hideForm?: boolean;
}) {
  return (
    <footer
      className={cn(
        "flex w-full flex-col gap-16 px-2.5 pb-40 pt-10 md:gap-44 md:px-7 md:py-10",
        className,
      )}
    >
      <div className="flex w-full flex-col items-start justify-between gap-16 md:flex-row">
        <div className="inline-block aspect-square w-16 md:w-96">
          <WhiteLogo />
        </div>
        <div className="flex h-full w-full flex-col gap-32 md:w-1/2 md:gap-44">
          <div className="flex w-full flex-col justify-between gap-16 md:flex-row">
            <div className="order-last flex w-full flex-col gap-6 md:order-none">
              <div className="space-y-3 md:space-y-6">
                <Text variant="inactive">press</Text>
                <Text>work@grbpwr.com</Text>
              </div>
              <div className="space-y-3 md:space-y-6">
                <Text variant="inactive">help</Text>
                <Text>client@grbpwr.com</Text>
              </div>
            </div>
            <div className="order-first w-full space-y-16 md:order-none">
              <FooterNav className="flex-col gap-6 uppercase" />
              <div className="w-full">
                <CurrencyPopover align="start" title="Currency:" />
              </div>
            </div>
          </div>
          <NewslatterForm />
        </div>
      </div>
      <div className="flex w-full flex-col justify-between gap-16 md:flex-row">
        <Text className="order-last uppercase md:order-first">
          {`grbpwr ${currentYear()}©`}
        </Text>
        <div className="order-first flex w-full justify-between md:order-last md:w-1/2">
          {links.map((link) => (
            <Button asChild key={link.text} className="uppercase">
              <Link href={link.href}>{link.text}</Link>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
