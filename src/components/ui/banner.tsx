import { cn } from "@/lib/utils";

export function Banner({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "blackTheme fixed inset-x-2 top-2 z-30 bg-bgColor text-textColor mix-blend-hard-light lg:bottom-2 lg:left-auto lg:top-auto lg:w-96",
        className,
      )}
    >
      {children}
    </div>
  );
}
