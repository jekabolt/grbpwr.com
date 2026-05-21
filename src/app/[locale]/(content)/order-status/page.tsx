import { getTranslations, setRequestLocale } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";
import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";

import OrderStatusForm from "../_components/order-status-form";

export default async function OrderStatus({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { dictionary } = await serviceClient.GetHero({});
  const isWebsiteEnabled = dictionary?.siteEnabled;
  setRequestLocale(locale);
  const t = await getTranslations("order-status");
  return (
    <FlexibleLayout theme={isWebsiteEnabled ? "light" : "dark"}>
      <div className="h-full space-y-12 px-2.5 pt-24 lg:space-y-16 lg:px-96">
        <div className="space-y-9">
          <Text variant="uppercase">{t("order status")}</Text>
          <Text>{t("text")}</Text>
        </div>
        <FieldsGroupContainer
          stage="1/1"
          title={t("check your order status")}
          collapsible={false}
        >
          <OrderStatusForm />
        </FieldsGroupContainer>
      </div>
    </FlexibleLayout>
  );
}
