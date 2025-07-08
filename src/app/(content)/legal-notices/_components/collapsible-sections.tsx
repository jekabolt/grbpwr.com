"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Text } from "@/components/ui/text";
import FieldsGroupContainer from "@/app/(checkout)/checkout/_components/new-order-form/fields-group-container";

export function CollapsibleSections({
  content,
  skipFirstSectionNumber = false,
  showDirectly = false,
}: {
  content: string;
  skipFirstSectionNumber?: boolean;
  showDirectly?: boolean;
}) {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const sections = content.split(/(?=^## )/m).filter(Boolean);
  const contentSections = sections;

  const toggleSection = (index: number) => {
    setOpenSection((prev) => (prev === index ? null : index));
  };

  if (showDirectly) {
    return (
      <Text
        component="span"
        className="prose-headings:!text-foreground prose-p:!text-foreground prose-strong:!text-foreground prose-ul:!text-foreground prose-li:!text-foreground prose max-w-none"
        style={{
          "--tw-prose-bullets": "hsl(var(--foreground))",
          "--tw-prose-counters": "hsl(var(--foreground))",
        }}
      >
        <ReactMarkdown>{content.replace(/\n/g, "  \n")}</ReactMarkdown>
      </Text>
    );
  }

  return (
    <div>
      <div className="space-y-8">
        {contentSections.map((section, index) => {
          const lines = section.split("\n");
          const heading = lines[0].replace("## ", "");
          const sectionContent = lines
            .slice(1)
            .join("\n")
            .replace(/\n/g, "  \n");

          return (
            <FieldsGroupContainer
              key={index}
              stage={
                skipFirstSectionNumber && index === 0
                  ? ""
                  : String(skipFirstSectionNumber ? index : index + 1).padStart(
                      2,
                      "0",
                    )
              }
              title={heading}
              isOpen={openSection === index}
              onToggle={() => toggleSection(index)}
            >
              <Text
                component="span"
                className="prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose max-w-none"
                style={{
                  "--tw-prose-bullets": "hsl(var(--foreground))",
                  "--tw-prose-counters": "hsl(var(--foreground))",
                }}
              >
                <ReactMarkdown>{sectionContent}</ReactMarkdown>
              </Text>
            </FieldsGroupContainer>
          );
        })}
      </div>
    </div>
  );
}
