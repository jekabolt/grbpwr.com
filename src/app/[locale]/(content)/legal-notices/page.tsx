import { setRequestLocale } from "next-intl/server";

import { LegalNoticesClient } from "./legal-notices-client";

export default async function LegalNoticesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalNoticesClient locale={locale} />;
}
