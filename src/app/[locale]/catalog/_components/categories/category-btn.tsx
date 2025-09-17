import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CategoryButton({
  href,
  children,
  disabled = false,
  variant = "default",
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: "default" | "underline";
}) {
  return (
    <Button
      asChild={!disabled}
      variant={variant}
      className="whitespace-nowrap uppercase hover:underline"
      disabled={disabled}
    >
      {disabled ? <>{children}</> : <Link href={href}>{children}</Link>}
    </Button>
  );
}
