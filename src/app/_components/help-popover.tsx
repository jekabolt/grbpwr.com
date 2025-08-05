import Link from "next/link";

import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";
import { MinusIcon } from "@/components/ui/icons/minus";
import { PlusIcon } from "@/components/ui/icons/plus";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

export default function HelpPopover() {
  return (
    <GenericPopover
      contentProps={{
        align: "start",
      }}
      className="px-0"
      openElement={(isOpen) => (
        <div className="flex items-center gap-x-2">
          <Text variant="uppercase">help</Text>
          <Text className="leading-none">
            {isOpen ? <MinusIcon /> : <PlusIcon />}
          </Text>
        </div>
      )}
    >
      <div className="space-y-2">
        <CopyText
          text="CLIENT@GRBPWR.COM"
          variant="undrleineWithColors"
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
