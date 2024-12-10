import Link from "next/link";
import { FOOTER_LINKS as links, FOOTER_YEAR as year } from "@/constants";

import { serviceClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// import FooterForm from "@/components/forms/";
import CurrencyPopover from "./currency-popover";

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
        "grid grid-cols-1 gap-14 p-2 text-textColor lg:grid-cols-2 lg:gap-10",
        className,
      )}
    >
      <div className="col-span-1 text-7xl lg:order-last">
        footer form
        {/* {!hideForm && <FooterForm formSubmitClick={formSubmitClick} />} */}
      </div>

      <div className="col-span-1 flex h-full flex-col gap-4 text-xs lg:flex-row-reverse lg:justify-between">
        <div className="flex space-x-5">
          {links.map((link) => (
            <Button asChild key={link.text}>
              <Link href={link.href}>{link.text}</Link>
            </Button>
          ))}
        </div>

        <div className="flex justify-between gap-4 lg:flex-row-reverse">
          <div className="flex items-start gap-6 lg:gap-10">
            <div>grbpwr {year}©</div>
            <Button asChild>
              <Link href="privacy-policy">privacy policy</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
