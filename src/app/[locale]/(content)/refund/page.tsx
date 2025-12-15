import { useTranslations } from "next-intl";

import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import { RefundForm } from "./_components";

export default function Refund() {
  const t = useTranslations("refund");
  return (
    <FlexibleLayout>
      <div className="h-full space-y-12 px-2.5 pt-24 lg:space-y-16 lg:px-28">
        <div className="space-y-9">
          <Text variant="uppercase">{t("return status")}</Text>
          <Text>{t("text")}</Text>
        </div>
        <RefundForm />
      </div>
    </FlexibleLayout>
  );
}
