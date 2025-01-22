import AdditionalNavigationLayout from "@/components/additional-navigation-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdditionalNavigationLayout>
      <div className="px-4 text-sm md:text-base lg:px-32 lg:py-10 lg:text-lg">
        {children}
      </div>
    </AdditionalNavigationLayout>
  );
}
