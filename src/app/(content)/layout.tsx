import { Header } from "../_components/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="prose px-14 lg:prose-xl">{children}</div>
    </div>
  );
}
