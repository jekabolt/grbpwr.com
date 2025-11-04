import { getTranslations } from "next-intl/server";

import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import { UnsubscribeForm } from "./_components/unsubscribe-form";

interface Props {
  params: Promise<{
    email: string;
  }>;
}

export default async function Unsubscribe(props: Props) {
  const t = await getTranslations("unsubscribe");
  const params = await props.params;
  const { email } = params;

  return (
    <FlexibleLayout>
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-2.5 lg:px-0">
        <Text className="w-full px-5 text-center leading-none lg:w-[400px]">
          {t("title")}
        </Text>
        <UnsubscribeForm email={email} />
      </div>
    </FlexibleLayout>
  );
}
