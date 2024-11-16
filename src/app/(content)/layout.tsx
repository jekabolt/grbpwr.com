import { Header } from "../_components/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="px-4 text-sm md:text-base lg:px-32 lg:py-10 lg:text-lg">
        {children}
      </div>
    </div>
  );
}
