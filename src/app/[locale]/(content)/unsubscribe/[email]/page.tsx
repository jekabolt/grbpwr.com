import { setRequestLocale } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";

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
  const { dictionary } = await serviceClient.GetHero({});
  const isWebsiteEnabled = dictionary?.siteEnabled;
  return (
    <FlexibleLayout theme={isWebsiteEnabled ? "light" : "dark"}>
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-2.5 lg:px-0">
        <UnsubscribeForm email={email} />
      </div>
    </FlexibleLayout>
  );
}
