import AdditionalNavigationLayout from "@/components/additional-navigation-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // change to correct layout, which is herader and footer with small logo
    <AdditionalNavigationLayout>
      <div className="px-4 text-sm lg:px-32 lg:py-10">{children}</div>
    </AdditionalNavigationLayout>
  );
}
