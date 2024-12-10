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
    <div className="min-h-screen space-y-2 bg-bgColor p-2">
      <Header />
      <div className="w-full space-y-20 px-2 md:px-0 lg:w-full">{children}</div>
      <Footer className="mt-24" hideForm={hideForm} />
    </div>
  );
}
