import Link from "next/link";
import { FOOTER_LINKS as links, FOOTER_YEAR as year } from "@/constants";

import { serviceClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/icons/logo";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";

import { Content } from "./content";
import CurrencyPopover from "./currency-popover";

// import FooterForm from "@/components/forms/";

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

export function Footer({
  className,
  hideForm,
}: {
  className?: string;
  hideForm?: boolean;
}) {
  async function formSubmitClick(data: FormData): Promise<void> {
    "use server";

    try {
      const payload: { email: string; name: string } = {
        email: data.get("email") as string,
        name: "no field for name",
      };
      await serviceClient.SubscribeNewsletter(payload);
    } catch (error) {
      throw error;
    }
  }

  const currentCurrency = "eth";

  return (
    <footer
      className={cn(
        "relative flex h-full w-full flex-col items-start gap-[70px] bg-black md:h-screen md:flex-row md:justify-between",
        className,
      )}
    >
      <Text variant="inactive" className="absolute bottom-0 uppercase">
        {`grbpwr ${year}©`}
      </Text>
      <div className=" w-2/3 p-2 md:w-1/3 md:p-6">
        <Logo />
      </div>

      <div className="flex h-full w-full flex-col gap-[96px] pt-6 md:w-1/2 md:justify-between">
        <div className="flex w-full flex-col justify-between gap-[40px] md:flex-row">
          <div className="flex w-full flex-row gap-6 md:flex-col">
            <div className="space-y-6">
              <Text variant="inactive">press</Text>
              <Text className="text-white">work@grbpwr.com</Text>
            </div>
            <div className="space-y-6">
              <Text variant="inactive">help</Text>
              <Text className="text-white">client@grbpwr.com</Text>
            </div>
          </div>
          <div className="w-full space-y-10">
            <Content className="flex-col gap-6  uppercase text-white" />
            <div className="w-full">
              <CurrencyPopover align="start" title="Currency:" />
            </div>
          </div>
        </div>
        <form action={formSubmitClick}>
          <div className="w-full space-y-6">
            <Text variant="uppercase" className="text-white">
              newsletter
            </Text>
            <div>
              <label htmlFor="email" className="text-white">
                e-mail adress
              </label>
              <Input
                name="email"
                type="email"
                placeholder="enter your e-mail"
                className="border-b border-white bg-black text-white focus:border-b focus:border-white focus:outline-none"
              />
            </div>
            <div>
              <Button
                type="submit"
                size="lg"
                variant="main"
                className="border border-white uppercase"
              >
                subscribe
              </Button>
            </div>
          </div>
        </form>
        <div className="flex justify-end space-x-5 text-white md:justify-between">
          {links.map((link) => (
            <Button asChild key={link.text}>
              <Link href={link.href}>{link.text}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* <div className="col-span-1 text-7xl lg:order-last">
        footer form
        {/* {!hideForm && <FooterForm formSubmitClick={formSubmitClick} />}
      {/* </div> */}

      {/* <div className="col-span-1 flex h-full flex-col gap-4 text-xs lg:flex-row-reverse lg:justify-between"> */}
      {/* <div className="flex space-x-5">
          {links.map((link) => (
            <Button asChild key={link.text}>
              <Link href={link.href}>{link.text}</Link>
            </Button>
          ))}
        </div> */}

      {/* <div className="flex justify-between gap-4 lg:flex-row-reverse">
          <div className="flex items-start gap-6 lg:gap-10">
            <div>grbpwr {year}©</div>
            <Button asChild>
              <Link href="privacy-policy">privacy policy</Link>
            </Button>
          </div>
        </div> */}
      {/* </div> */}
    </footer>
  );
}
