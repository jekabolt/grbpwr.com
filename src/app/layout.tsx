import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/Header";

import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={cn(inter.className, "relative min-h-screen space-y-5")}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
