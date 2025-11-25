"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";

import FieldsGroupContainer from "../(checkout)/checkout/_components/new-order-form/fields-group-container";

const LINKS = [
  { title: "legal notices", href: "/legal-notices" },
  { title: "order status", href: "/order-status" },
];

export function FooterNavMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("footer");

  function handleToggle() {
    setIsOpen((v) => !v);
  }

  return (
    <div className="mb-4 space-y-4">
      <div className="border-b border-textInactiveColor">
        <FieldsGroupContainer
          title={t("help")}
          isOpen={isOpen}
          clickableAreaClassName="h-8"
          childrenSpacingClass="space-y-4 py-4"
          signType="plus-minus"
          onToggle={handleToggle}
        >
          <CopyText text="CLIENT@GRBPWR.COM" mode="toaster" />
          <Button asChild className="uppercase">
            <Link href="/aftersale-services">{t("aftersale services")}</Link>
          </Button>
          <Button asChild className="uppercase">
            <Link href="/faq">{t("faqs")}</Link>
          </Button>
        </FieldsGroupContainer>
      </div>
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
