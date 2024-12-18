import Image from "@/components/ui/image";

import { Logo } from "./ui/logo";

export default function LogoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen space-y-2 bg-bgColor p-2 pb-20">
      <Logo />
      <div className="w-full space-y-10 px-2 md:px-0 lg:w-full lg:space-y-20">
        {children}
      </div>
    </div>
  );
}
