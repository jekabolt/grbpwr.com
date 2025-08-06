"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";

import FieldsGroupContainer from "../(checkout)/checkout/_components/new-order-form/fields-group-container";

const LINKS = [
  { title: "legal notices", href: "/legal-notices" },
  { title: "order status", href: "/order-status" },
];

export function FooterNavMobile() {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((v) => !v);
  }

  return (
    <div className="mb-4 space-y-4">
      <div className="border-b border-textInactiveColor">
        <FieldsGroupContainer
          title="help"
          isOpen={isOpen}
          styling={{
            clickableAreaClassName: "h-8",
            clickableArea: "full",
            childrenSpacing: "space-y-4",
          }}
          onToggle={handleToggle}
        >
          <CopyText text="client@grbpwr.com" />
          <Button asChild className="uppercase">
            <Link href="/aftersale-services">aftersales service</Link>
          </Button>
          <Button asChild className="uppercase">
            <Link href="/faq">faqs</Link>
          </Button>
        </FieldsGroupContainer>
      </div>
      {LINKS.map((link, i) => (
        <Button
          key={i}
          asChild
          className="h-8 border-b border-textInactiveColor uppercase"
        >
          <Link href={link.href}>{link.title}</Link>
        </Button>
      ))}
    </div>
  );
}
