import FlexibleLayout from "@/components/flexible-layout";

export const dynamic = "force-static";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FlexibleLayout headerType="catalog" footerType="mini">
      <div className="px-4 text-sm md:text-base lg:px-32 lg:py-10 lg:text-lg">
        {children}
      </div>
    </FlexibleLayout>
  );
}
