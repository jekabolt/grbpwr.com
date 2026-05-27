import { getTranslations, setRequestLocale } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import AftersaleForm from "./_components";

export default async function AftersaleServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aftersale-services");
  const { dictionary } = await serviceClient.GetHero({});
  const isWebsiteEnabled = dictionary?.siteEnabled;
  return (
    <FlexibleLayout theme={isWebsiteEnabled ? "light" : "dark"}>
      <div
        id="aftersale-services-page"
        className="min-dvh flex h-full w-full flex-col items-center justify-center gap-12 px-2.5 py-24 text-textColor lg:gap-16 lg:px-96"
      >
        <Text variant="uppercase" className="w-full text-center lg:text-left">
          {t("aftersale services")}
        </Text>
        <div className="w-full">
          <AftersaleForm />
        </div>
      </div>
    </FlexibleLayout>
  );
}
