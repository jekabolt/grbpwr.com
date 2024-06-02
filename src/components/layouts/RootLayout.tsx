type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return <div className="lightTheme relative min-h-screen">{children}</div>;
}
