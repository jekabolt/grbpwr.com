import Link from "next/link";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";
import { Text } from "@/components/ui/text";

export const metadata = generateCommonMetadata({
  title: "about".toUpperCase(),
});

export default function Component() {
  return (
    <div className="space-y-20">
      <div className="space-y-4">
        <Text variant="uppercase">
          grbpwr is a creative tech company focused on collaboration through
          digital and physical experience.
        </Text>
        <Text variant="uppercase">
          appreciate action, not criticizing inaction.
        </Text>
        <Text variant="uppercase">founded 2018</Text>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-0">
          <Text variant="uppercase">customers</Text>
          <Text size="small" component="span" className="block leading-none">
            If you are a customer or you got questions or problems please
            contact us via email&nbsp;
            <span className="inline-flex items-center">
              <CopyText text="customercare@grbpwr.com" mode="toaster" />
            </span>
          </Text>
        </div>
        <div>
          <Text variant="uppercase">corporation</Text>
          <Text size="small" component="span" className="block leading-none">
            If you are a designer, store or other business entity please contact
            us via email&nbsp;
            <span className="inline-flex items-center">
              <CopyText text="work@grbpwr.com" mode="toaster" />
            </span>
          </Text>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <Text
          variant="uppercase"
          size="giant"
          component="h1"
          className="flex w-[95%] justify-center overflow-hidden"
        >
          contact us
        </Text>
      </div>
      <div className="flex gap-6">
        <Button variant="underlineWithColors" asChild>
          <Link href="/terms-and-conditions">terms of service</Link>
        </Button>
        <Button variant="underlineWithColors" asChild>
          <Link href="/privacy-policy">privacy policy</Link>
        </Button>
        <Button variant="underlineWithColors" asChild>
          <Link href="/shipping">shipping policy</Link>
        </Button>
        <Button variant="underlineWithColors" asChild>
          <Link href="/refund-return-policy">return policy</Link>
        </Button>
      </div>
    </div>
  );
}
