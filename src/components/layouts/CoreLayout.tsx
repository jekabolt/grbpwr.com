import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import Link from "next/link";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-7xl">
      <Header />
      <div className="flex">
        <div className="relative hidden w-24 text-sm text-blue-500 underline md:block">
          <div className="sticky top-24 flex flex-col items-center gap-60">
            <Link href="/catalog">Catalog</Link>
            <Link href="/archive">Archive</Link>
            <Link href="/shipping">Shipping</Link>
          </div>
        </div>

        <div className="w-full space-y-20 px-2 md:px-0 lg:w-[calc(100%-192px)]">
          {children}
        </div>

        <div className="relative hidden w-24 text-sm text-blue-500 underline md:block">
          <div className="sticky top-24 flex flex-col items-center gap-60">
            <Link href="/cart">Cart</Link>
            <Link href="/about">About</Link>
            <Link href="/contacts">Contacts</Link>
          </div>
        </div>
      </div>
      <Footer className="mt-24" />
    </div>
  );
}
