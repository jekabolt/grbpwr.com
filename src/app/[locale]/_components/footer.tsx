"use client";

import {
  currencySymbols,
  FOOTER_YEAR,
  FOOTER_LINKS as links,
} from "@/constants";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { WhiteLogo } from "@/components/ui/icons/white-logo";
import { Logo } from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { CountriesPopup } from "./CountriesPopup";
import { FooterNavMobile } from "./footer-nav-mobile";
import HelpPopover from "./help-popover";
import NewslatterForm from "./newslatter-form";

function LiveClock() {
  const [timestamp, setTimestamp] = useState<number>(FOOTER_YEAR);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimestamp(Math.floor(Date.now() / 1000));

    const interval = setInterval(() => {
      setTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text variant="uppercase" className="text-textColor">
      {isClient ? timestamp : FOOTER_YEAR}
    </Text>
  );
}

export function Footer({ theme = "light" }: { theme?: "light" | "dark" }) {
  const t = useTranslations("footer");

  const { currentCountry, openCountryPopup } = useTranslationsStore((s) => s);

  return (
    <footer className="flex w-full flex-col space-y-16 bg-bgColor px-2.5 pb-16 text-textColor lg:space-y-0 lg:px-0 lg:pb-10">
      <div className="flex justify-center pt-16 lg:py-52">
        <div className="flex w-full flex-col gap-y-16 lg:w-auto lg:flex-row lg:gap-x-20">
          <div className="flex justify-center lg:justify-end">
            {/* Mobile: iframe */}
            <iframe
              src={
                theme === "dark"
                  ? "https://art.grbpwr.com/invert"
                  : "https://art.grbpwr.com"
              }
              className="h-40 w-40 border-0 lg:hidden"
              title="Art"
            />
            {/* Desktop: logo */}
            {theme === "dark" ? (
              <Logo className="hidden aspect-square h-full w-40 lg:block" />
            ) : (
              <WhiteLogo className="hidden aspect-square h-full w-40 lg:block" />
            )}
          </div>
          <div className="w-full lg:w-[346px]">
            <NewslatterForm />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-x-24 lg:flex-row lg:px-7">
        <div className="order-4 flex justify-center gap-2 lg:order-1 lg:justify-start">
          <Text variant="uppercase" className="uppercase transition-colors hover:text-textInactiveColor active:text-highlightColor">grbpwr</Text>
          <LiveClock />
        </div>
        <div className="order-3 flex justify-center gap-24 py-16 lg:order-2 lg:py-0">
          {links.map((l) => (
            <Button asChild key={l.text} className="uppercase">
              <Link href={l.href}>{l.text}</Link>
            </Button>
          ))}
        </div>
        <div className="order-3 hidden gap-24 lg:flex">
          <HelpPopover theme={theme} />
          <Button className="uppercase" asChild>
            <Link href="/legal-notices">{t("legal notices")}</Link>
          </Button>
          <Button className="uppercase" asChild>
            <Link href="/order-status">{t("order status")}</Link>
          </Button>
        </div>
        <div className="order-1 block lg:hidden">
          <FooterNavMobile />
        </div>
        <div className="order-2 flex lg:order-4">
          <Button
            className="hidden uppercase lg:block"
            onClick={openCountryPopup}
          >
            {t("country")}: {currentCountry.name} /{" "}
            {currencySymbols[currentCountry.currencyKey || "EUR"]}
          </Button>
          <CountriesPopup />
        </div>
      </div>
    </footer>
  );
}
