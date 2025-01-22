import { MiniFooter } from "@/app/_components/mini-footer";

import { Header } from "../app/_components/header";

export default function AdditionalNavigationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  hideForm?: boolean;
}>) {
  return (
    <div className="relative min-h-screen bg-bgColor">
      <Header />
      <div className="w-full md:px-0">{children}</div>
      <MiniFooter />
    </div>
  );
}
