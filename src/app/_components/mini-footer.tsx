import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/icons/logo";

import CurrencyPopover from "./currency-popover";
import { FooterNav } from "./footer-nav";

export function MiniFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "blackTheme w-full bg-bgColor p-2.5 pb-28 text-textColor lg:py-10 lg:pl-10 lg:pr-2",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-16 lg:flex-row lg:justify-between">
        <div className="inline-block aspect-square size-28">
          <Logo />
        </div>
        <div className="grid gap-y-16 lg:grid-cols-3 lg:gap-x-36 lg:gap-y-6">
          <FooterNav
            isMini
            className="col-span-3 grid gap-y-6 uppercase lg:grid-cols-3 lg:gap-x-36"
          />
          <div className="leading-none lg:col-start-3">
            <CurrencyPopover align="start" title="Currency:" />
          </div>
        </div>
      </div>
    </footer>
  );
}
