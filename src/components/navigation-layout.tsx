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
    <div className="relative min-h-screen bg-bgColor pb-14 lg:pb-0">
      <Header />
      <div className="w-full lg:w-full">{children}</div>
      <Footer className="mt-24" hideForm={hideForm} />
    </div>
  );
}
