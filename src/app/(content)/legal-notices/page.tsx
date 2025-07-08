"use client";

import { useState } from "react";

import FlexibleLayout from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { CookieContent } from "@/app/(content)/legal-notices/_components/cookie-content";

import { CollapsibleSections } from "./_components/collapsible-sections";
import { useMarkdownContent } from "./_components/use-markdown-content";

type LegalSection =
  | "privacy"
  | "terms"
  | "cookies"
  | "return-exchange"
  | "terms-of-sale"
  | "legal-notice";

const legalSections: Record<LegalSection, { title: string; file?: string }> = {
  privacy: {
    title: "Privacy Policy",
    file: "/content/legal/privacy-policy.md",
  },
  terms: {
    title: "Terms and Conditions of Use",
    file: "/content/legal/terms-conditions.md",
  },
  "terms-of-sale": {
    title: "Terms and Conditions of Sale",
    file: "/content/legal/terms-of-sale.md",
  },
  "legal-notice": {
    title: "Legal Notice",
    file: "/content/legal/legal-notice.md",
  },
  "return-exchange": {
    title: "Return and Exchange Policy",
    file: "/content/legal/return-exchange.md",
  },
  cookies: {
    title: "Cookie Settings",
  },
};

export default function LegalNotices() {
  const [selectedSection, setSelectedSection] =
    useState<LegalSection>("privacy");
  const { content } = useMarkdownContent(
    legalSections[selectedSection].file || "",
  );

  return (
    <FlexibleLayout footerType="mini">
      <div className="flex h-full justify-between lg:py-24">
        <div className="flex w-1/2 flex-col pl-40">
          <div className="space-y-10">
            <Text>Legal Notices</Text>
            <div className="space-y-4">
              {Object.entries(legalSections).map(([key, section]) => (
                <Button
                  key={key}
                  variant={selectedSection === key ? "underline" : "default"}
                  onClick={() => setSelectedSection(key as LegalSection)}
                >
                  {section.title}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-1/2 pr-40">
          {selectedSection === "cookies" ? (
            <CookieContent autoSave={true} />
          ) : (
            <CollapsibleSections
              key={selectedSection}
              content={content}
              skipFirstSectionNumber={
                selectedSection === "terms" ||
                selectedSection === "terms-of-sale"
              }
              showDirectly={selectedSection === "legal-notice"}
            />
          )}
        </div>
      </div>
    </FlexibleLayout>
  );
}
