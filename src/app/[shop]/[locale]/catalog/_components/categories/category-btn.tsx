import Link from "next/link";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CategoryUndoButton({ href }: { href: string }) {
  const t = useTranslations("catalog");

  return <CategoryButton href={href}>{t("undo")}</CategoryButton>;
}

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
      className={cn("whitespace-nowrap uppercase", {
        "hover:underline": variant === "default",
      })}
      disabled={disabled}
    >
      {disabled ? <>{children}</> : <Link href={href}>{children}</Link>}
    </Button>
  );
}
