"use client";

import { useState } from "react";

import { Text } from "@/components/ui/text";

import { CollapsibleSections } from "./collapsible-sections";
import { legalSections, type LegalSection } from "./constant";
import { CookieContent } from "./cookie-content";
import { useMarkdownContent } from "./use-markdown-content";

export function MobileNotices() {
  const [selectedSection, setSelectedSection] = useState<LegalSection | null>(
    null,
  );
  const legalSectionsArray = Object.entries(legalSections);

  return (
    <div className="space-y-32 p-2.5">
      {legalSectionsArray.map(([key, section]) => {
        const { content } = useMarkdownContent(section.file || "");
        return (
          <div key={key} className="space-y-4">
            <Text variant="uppercase" className="font-semibold">
              {section.title}
            </Text>
            <div className="w-full">
              {key === "cookies" ? (
                <CookieContent autoSave={true} />
              ) : (
                <CollapsibleSections
                  key={key}
                  content={content}
                  skipFirstSectionNumber={
                    key === "terms" || key === "terms-of-sale"
                  }
                  showDirectly={key === "legal-notice"}
                  onSectionChange={(section) =>
                    setSelectedSection(section as LegalSection)
                  }
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
