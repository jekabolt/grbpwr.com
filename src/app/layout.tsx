import type { Metadata } from "next";
import RootLayoutComponent from "@/components/layouts/RootLayout";
import { FeatureMono } from "../fonts";
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
        <RootLayoutComponent>{children}</RootLayoutComponent>
      </body>
    </html>
  );
}
