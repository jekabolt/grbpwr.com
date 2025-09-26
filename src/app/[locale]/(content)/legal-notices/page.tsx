"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import FlexibleLayout from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { CookieContent } from "@/app/[locale]/(content)/_components/cookie-content";

import { CollapsibleSections } from "../_components/collapsible-sections";
import { LegalSection, legalSections } from "../_components/constant";
import { useMarkdownContent } from "../_components/use-markdown-content";

export default function LegalNotices() {
  const locale = useLocale();
  const t = useTranslations("content");
  const [selectedSection, setSelectedSection] =
    useState<LegalSection>("privacy");

  const selectedFile = legalSections[selectedSection].file || "";
  const localizedCandidates = selectedFile
    ? [
        selectedFile
          .replace("/content/legal/", `/content/legal/`)
          .replace(".md", `/${locale}.md`),
        selectedFile
          .replace("/content/legal/", `/content/legal/`)
          .replace(".md", "/en.md"),
        selectedFile,
      ]
    : "";

  const { content } = useMarkdownContent(localizedCandidates);

  return (
    <FlexibleLayout>
      <div className="flex h-full flex-col space-y-20 px-2.5 pb-20 pt-10 lg:flex-row lg:justify-between lg:py-24">
        <div className="flex w-full flex-col lg:w-1/2 lg:pl-8 lg:pt-56">
          <div className="space-y-10">
            <Text className="uppercase">{t("legal notices")}</Text>
            <div className="space-y-4">
              {Object.entries(legalSections).map(([key, section]) => (
                <Button
                  key={key}
                  variant={selectedSection === key ? "underline" : "default"}
                  onClick={() => setSelectedSection(key as LegalSection)}
                  className="uppercase"
                >
                  {t(section.title)}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:pr-40">
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
