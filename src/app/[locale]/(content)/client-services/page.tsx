import Link from "next/link";
import { useTranslations } from "next-intl";

import FlexibleLayout from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";
import { Text } from "@/components/ui/text";

export default function ClientServices() {
  const t = useTranslations("client-services");
  const tContent = useTranslations("content");
  
  return (
    <FlexibleLayout>
      <div className="h-full space-y-12 px-2.5 pt-8 lg:space-y-32 lg:px-28 lg:pt-32">
        <div className="space-y-8">
          <Text variant="uppercase">{t("title")}</Text>
          <Text>
            {t("welcome")}
            <br /> {t("description")}
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
                <Link href="/faq">{tContent("frequently asked questions")}</Link>
              </Button>
              <Text>
                {t("faq description")}
              </Text>
            </div>
            <div className="space-y-8">
              <Button
                variant="underlineWithColors"
                className="uppercase"
                asChild
              >
                <Link href="/aftersale-services">{t("after sales title")}</Link>
              </Button>
              <Text>
                {t("after sales description")}
              </Text>
            </div>
          </div>
          <div className="space-y-8">
            <Text className="uppercase">{t("email")}</Text>
            <CopyText variant="color" mode="toaster" text="info@grbpwr.com" />
          </div>
        </div>
      </div>
    </FlexibleLayout>
  );
}
