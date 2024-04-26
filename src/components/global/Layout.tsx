import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import Link from "next/link";

export default function Layout({
  children,
  topContent = null,
}: Readonly<{
  children: React.ReactNode;
  topContent?: React.ReactNode;
}>) {
  return (
    <div>
      {topContent}
      <div className="mx-auto max-w-7xl">
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
      </div>
    </div>
  );
}
