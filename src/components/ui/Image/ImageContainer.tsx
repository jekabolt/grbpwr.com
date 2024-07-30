export default function ImageContainer({
  aspectRatio,
  children,
}: {
  aspectRatio: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full w-full" style={{ aspectRatio }}>
      {children}
    </div>
  );
}
