import { setRequestLocale } from "next-intl/server";

import { FaqClient } from "./faq-client";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FaqClient locale={locale} />;
}
