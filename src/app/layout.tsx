import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/global/Header";

import Footer from "@/components/global/Footer";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import "./globals.css";

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
      <body className={cn(inter.className, "relative min-h-screen")}>
        <Header />
        <div className="flex w-full">
          {/* left links */}
          <div className="sticky top-20 flex h-[calc(100vh-80px)] w-24 flex-col justify-between px-5 py-3">
            <Link href="/catalog">Catalog</Link>
            <Link href="/archive">Archive</Link>
            <Link href="/shipping">Shipping</Link>
          </div>
          <div className="grow">{children}</div>
          {/* right links */}
          <div className="sticky top-20 flex h-[calc(100vh-80px)] w-24 flex-col justify-between px-5 py-3">
            {/* should be dynamic component */}
            <Link href="/cart">Cart</Link>
            <Link href="/about">About</Link>
            <Link href="/contacts">Contacts</Link>
          </div>
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
