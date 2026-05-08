import { getTranslations, setRequestLocale } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import { UnsubscribeForm } from "./_components/unsubscribe-form";

interface Props {
  params: Promise<{
    locale: string;
    email: string;
  }>;
}

export default async function Unsubscribe(props: Props) {
  const params = await props.params;
  const { locale, email } = params;

  setRequestLocale(locale);
  const t = await getTranslations("unsubscribe");
  const { dictionary } = await serviceClient.GetHero({});
  const isWebsiteEnabled = dictionary?.siteEnabled;
  return (
    <FlexibleLayout theme={isWebsiteEnabled ? "light" : "dark"}>
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-2.5 lg:px-0">
        <Text className="w-full px-5 text-center leading-none lg:w-[400px]">
          {t("title")}
        </Text>
        <UnsubscribeForm email={email} />
      </div>
    </FlexibleLayout>
  );
}
