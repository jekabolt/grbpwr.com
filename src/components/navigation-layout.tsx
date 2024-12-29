import { Footer } from "../app/_components/footer";
import { Header } from "../app/_components/header";

export default function NavigationLayout({
  children,
  hideForm,
}: Readonly<{
  children: React.ReactNode;
  hideForm?: boolean;
}>) {
  return (
    <div className="relative min-h-screen bg-bgColor">
      <Header />
      <div className="w-full space-y-20 md:px-0">{children}</div>
      <Footer hideForm={hideForm} className="p-2 pb-14 md:p-0" />
    </div>
  );
}
