import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  // add header to this layout (invoices page)
  return (
    <div className="lightTheme relative min-h-screen">
      <Toaster />
      {children}
    </div>
  );
}
