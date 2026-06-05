"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

const LINKS = [
  { title: "aftersale services", href: "/aftersale-services" },
  { title: "order status", href: "/order-status" },
  { title: "faqs", href: "/faq" },
  { title: "returns", href: "/return" },
  { title: "legal notices", href: "/legal-notices" },
];

export function FooterNavMobile() {
  const t = useTranslations("footer");

  return (
    <div className="mb-4 space-y-4">
      {LINKS.map((link, i) => (
        <Button
          key={i}
          asChild
          className="h-8 border-b border-textInactiveColor uppercase"
        >
          <Link href={link.href}>{t(link.title)}</Link>
        </Button>
      ))}
    </div>
  );
}
