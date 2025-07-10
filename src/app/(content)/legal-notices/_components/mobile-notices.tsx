"use client";

import { Text } from "@/components/ui/text";

import { CollapsibleSections } from "./collapsible-sections";
import { legalSections, type LegalSection } from "./constant";
import { CookieContent } from "./cookie-content";
import { useAllLegalContent } from "./use-markdown-content";

export function MobileNotices() {
  const legalSectionsArray = Object.entries(legalSections);
  const legalContent = useAllLegalContent();

  const scrollToSection = (sectionKey: string) => {
    const element = document.getElementById(`section-${sectionKey}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-32 p-2.5">
      {legalSectionsArray.map(([key, section]) => {
        const { content } = legalContent[key as LegalSection];
        return (
          <div key={key} className="space-y-4" id={`section-${key}`}>
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
                  onSectionChange={scrollToSection}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
