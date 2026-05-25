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
      <div className="min-dvh px-2.5items-center flex h-screen w-full flex-col justify-center gap-12 py-24 lg:gap-16 lg:px-96">
        <div className="space-y-9">
          <Text variant="uppercase">{t("return order")}</Text>
          <Text>{t("text")}</Text>
        </div>
        <RefundForm />
      </div>
    </FlexibleLayout>
  );
}
