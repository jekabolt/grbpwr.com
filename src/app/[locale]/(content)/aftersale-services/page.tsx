import { useTranslations } from "next-intl";

import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import AftersaleForm from "./_components";

export default function AftersaleServicesPage() {
  const t = useTranslations("aftersale-services");
  return (
    <FlexibleLayout>
      <div className="h-full space-y-12 px-2.5 pt-24 lg:space-y-16 lg:px-28">
        <Text variant="uppercase">{t("aftersale services")}</Text>
        <AftersaleForm />
      </div>
    </FlexibleLayout>
  );
}
