import Link from "next/link";

import { Button } from "@/components/ui/button";
import CartPopup from "@/app/(checkout)/cart/_components/CartPopup";
import CartProductsList from "@/app/(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "@/app/(checkout)/cart/_components/CartTotalPrice";

import { Footer } from "./footer";
import { Header } from "./header";

export default async function NavigationLayout({
  children,
  hideForm,
}: Readonly<{
  children: React.ReactNode;
  hideForm?: boolean;
}>) {
  return (
    <div className="min-h-screen space-y-2 bg-bgColor p-2">
      <Header />
      <div className="w-full space-y-20 px-2 md:px-0 lg:w-full">{children}</div>
      <Footer className="mt-24" hideForm={hideForm} />
    </div>
  );
}
