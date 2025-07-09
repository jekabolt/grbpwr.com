"use client";

import { useState } from "react";

import FlexibleLayout from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { CookieContent } from "@/app/(content)/legal-notices/_components/cookie-content";

import { CollapsibleSections } from "./_components/collapsible-sections";
import { LegalSection, legalSections } from "./_components/constant";
import { MobileNotices } from "./_components/mobile-notices";
import { useMarkdownContent } from "./_components/use-markdown-content";

export default function LegalNotices() {
  const [selectedSection, setSelectedSection] =
    useState<LegalSection>("privacy");
  const { content } = useMarkdownContent(
    legalSections[selectedSection].file || "",
  );

  return (
    <FlexibleLayout footerType="mini">
      <div className="block lg:hidden">
        <MobileNotices />
      </div>
      <div className="hidden h-full justify-between lg:flex lg:py-24">
        <div className="flex w-1/2 flex-col pl-40">
          <div className="space-y-10">
            <Text className="uppercase">Legal Notices</Text>
            <div className="space-y-4">
              {Object.entries(legalSections).map(([key, section]) => (
                <Button
                  key={key}
                  variant={selectedSection === key ? "underline" : "default"}
                  onClick={() => setSelectedSection(key as LegalSection)}
                  className="uppercase"
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
              onSectionChange={(section) =>
                setSelectedSection(section as LegalSection)
              }
            />
          )}
        </div>
      </div>
    </FlexibleLayout>
  );
}
