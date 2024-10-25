import type { Metadata } from "next";
import { FeatureMono } from "../fonts";
import { CommonLayout } from "@/components/layouts/CommonLayout";

import "./globals.css";

export const metadata: Metadata = {
  title: "grbpwr.com title",
  description: "grbpwr.com desc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={FeatureMono.className}>
        <CommonLayout>{children}</CommonLayout>
      </body>
    </html>
  );
}
