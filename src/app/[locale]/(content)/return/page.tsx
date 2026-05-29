import { getTranslations, setRequestLocale } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import { RefundForm } from "./_components";

export default async function Refund({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("refund");
  const { dictionary } = await serviceClient.GetHero({});
  const isWebsiteEnabled = dictionary?.siteEnabled;
  return (
    <FlexibleLayout theme={isWebsiteEnabled ? "light" : "dark"}>
      <div
        id="refund-page"
        className="min-dvh flex h-full w-full flex-col items-center justify-center gap-12 px-2.5 py-24 text-textColor lg:gap-16 lg:px-96"
      >
        <div className="space-y-9">
          <Text variant="uppercase" className="text-center lg:text-left">
            {t("return order")}
          </Text>
          <Text className="text-justify lg:text-left">{t("text")}</Text>
        </div>
        <RefundForm />
      </div>
    </FlexibleLayout>
  );
}
