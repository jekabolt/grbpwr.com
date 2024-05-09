import type { Metadata } from "next";

import { cn } from "@/lib/utils";
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
      <body className={cn(FeatureMono.className, "relative min-h-screen")}>
        <main className="lightTheme">{children}</main>
      </body>
    </html>
  );
}
