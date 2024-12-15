import Image from "@/components/ui/image";

export default function LogoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen space-y-2 bg-bgColor p-2 pb-20">
      <div className="mx-auto mb-4 size-8 lg:mx-[inherit]">
        <Image src={"/grbpwr-logo.webp"} alt="grpwr logo" aspectRatio="1/1" />
      </div>
      <div className="w-full space-y-10 px-2 md:px-0 lg:w-full lg:space-y-20">
        {children}
      </div>
    </div>
  );
}
