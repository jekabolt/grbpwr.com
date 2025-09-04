import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";
import { MinusIcon } from "@/components/ui/icons/minus";
import { PlusIcon } from "@/components/ui/icons/plus";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

export default function HelpPopover({ theme }: { theme: "light" | "dark" }) {
  return (
    <GenericPopover
      variant="no-borders"
      contentProps={{
        align: "start",
        sideOffset: 10,
      }}
      className={cn("px-0", {
        "blackTheme bg-bgColor text-textColor": theme === "dark",
      })}
      openElement={(isOpen) => (
        <div className="flex items-center gap-x-2">
          <Text variant="uppercase">help</Text>
          <Text>{isOpen ? <MinusIcon /> : <PlusIcon />}</Text>
        </div>
      )}
    >
      <div className="space-y-2">
        <CopyText
          text="CLIENT@GRBPWR.COM"
          variant={theme === "dark" ? "underlined" : "undrleineWithColors"}
          mode="toaster"
        />
        <Button asChild className="uppercase">
          <Link href="/aftersale-services">aftersale services</Link>
        </Button>
        <Button asChild className="uppercase">
          <Link href="/faq">faqs</Link>
        </Button>
      </div>
    </GenericPopover>
  );
}
