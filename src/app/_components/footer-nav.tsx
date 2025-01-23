import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/shipping", label: "shipping" },
  { href: "/refund-return-policy", label: "refund and return policy" },
  { href: "/product-care", label: "product care" },
  { href: "/privacy-policy", label: "privacy policy" },
  { href: "/terms-and-conditions", label: "terms and conditions" },
  { href: "/customer-support", label: "customer support" },
];

export function FooterNav({
  className,
  isMini,
}: {
  className?: string;
  isMini?: boolean;
}) {
  const displayedItems = isMini
    ? navItems.filter((item) => item.href !== "/product-care")
    : navItems;

  return (
    <nav className={cn("flex", className)}>
      {displayedItems.map((item) => (
        <Button
          key={item.href}
          asChild
          className={cn(
            isMini && {
              "order-1 lg:col-start-1 lg:row-start-1":
                item.href === "/customer-support",
              "order-2 lg:col-start-2 lg:row-start-1":
                item.href === "/shipping",
              "order-3 lg:col-start-2 lg:row-start-2":
                item.href === "/refund-return-policy",
              "order-4 lg:col-start-3 lg:row-start-1":
                item.href === "/privacy-policy",
              "order-5 lg:col-start-3 lg:row-start-2":
                item.href === "/terms-and-conditions",
            },
          )}
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </nav>
  );
}
