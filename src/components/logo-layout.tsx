import Image from "@/components/ui/image";

export default function LogoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen space-y-2 bg-bgColor p-2">
      <div className="mb-4 size-8">
        <Image src={"/grbpwr-logo.webp"} alt="grpwr logo" aspectRatio="1/1" />
      </div>
      <div className="w-full space-y-20 px-2 md:px-0 lg:w-full">{children}</div>
    </div>
  );
}
