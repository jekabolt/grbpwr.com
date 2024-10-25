import type { Metadata } from "next";
import { FeatureMono } from "@/fonts";

import "./globals.css";

import { serviceClient } from "@/lib/api";
import { DataContextProvider } from "@/components/DataContext";

export const metadata: Metadata = {
  title: "grbpwr.com title",
  description: "grbpwr.com desc",
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const heroData = await serviceClient.GetHero({});

  return (
    <html lang="en">
      <body className={FeatureMono.className}>
        <DataContextProvider {...heroData}>
          <div className="lightTheme relative min-h-screen">{children}</div>
        </DataContextProvider>
      </body>
    </html>
  );
}
