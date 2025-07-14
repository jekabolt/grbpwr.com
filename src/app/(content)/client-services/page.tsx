import Link from "next/link";

import FlexibleLayout from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";
import { Text } from "@/components/ui/text";

export default function ClientServices() {
  return (
    <FlexibleLayout footerType="mini">
      <div className="h-full space-y-12 px-2.5 pt-8 lg:space-y-32 lg:px-28 lg:pt-32">
        <div className="space-y-8">
          <Text variant="uppercase">client service</Text>
          <Text>
            welcome to grbpwr.
            <br /> for inquiries or assistance please do not hesitate to contact
            us. we are open monday through saturday 9 am until 7 pm, excluding
            holidays.
          </Text>
        </div>
        <div className="space-y-20">
          <div className="flex flex-col justify-between gap-y-12 lg:flex-row">
            <div className="space-y-8">
              <Button
                variant="underlineWithColors"
                className="uppercase"
                asChild
              >
                <Link href="/faq">frequently asked questions</Link>
              </Button>
              <Text>
                you can use this area to consult the faq&apos;s, follow your
                order and track your return.
              </Text>
            </div>
            <div className="space-y-8">
              <Button
                variant="underlineWithColors"
                className="uppercase"
                asChild
              >
                <Link href="/aftersale-services">after sales service</Link>
              </Button>
              <Text>
                contact us for any questions pertaining to our repair and
                alteration services.
              </Text>
            </div>
          </div>
          <div className="space-y-8">
            <Text className="uppercase">email</Text>
            <CopyText variant="color" mode="toaster" text="info@grbpwr.com" />
          </div>
        </div>
      </div>
    </FlexibleLayout>
  );
}
