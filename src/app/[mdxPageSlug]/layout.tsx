import CoreLayout from "@/components/layouts/CoreLayout";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <CoreLayout>
      <div className="prose lg:prose-xl">{children}</div>
    </CoreLayout>
  );
}
