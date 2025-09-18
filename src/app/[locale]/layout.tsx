import { FeatureMono } from "@/fonts";
import { routing } from "@/i18n/routing";
import { GoogleTagManager } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { ToastProvider } from "@/components/ui/toaster";

import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = generateCommonMetadata();

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
      <body className={FeatureMono.className}>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <div className="lightTheme relative min-h-screen">{children}</div>
            <CookieBanner />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
