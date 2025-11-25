"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";

import { createMarkdownComponents } from "./markdown-components";

export function CollapsibleSections({
  content,
  skipFirstSectionNumber = false,
  showDirectly = false,
  onSectionChange,
  autoOpenFirst = false,
}: {
  content: string;
  skipFirstSectionNumber?: boolean;
  showDirectly?: boolean;
  onSectionChange?: (section: string) => void;
  autoOpenFirst?: boolean;
}) {
  const [openSection, setOpenSection] = useState<number | null>(
    autoOpenFirst ? 0 : null,
  );

  const sections = content.split(/(?=^## )/m).filter(Boolean);
  const contentSections = sections;

  const toggleSection = (index: number) => {
    setOpenSection((prev) => (prev === index ? null : index));
  };

  const markdownComponents = createMarkdownComponents(onSectionChange);

  if (showDirectly) {
    return (
      <Text
        component="span"
        className="prose max-w-none"
        style={{
          "--tw-prose-bullets": "hsl(var(--textColor))",
          "--tw-prose-counters": "hsl(var(--textColor))",
          "--tw-prose-headings": "hsl(var(--textColor))",
          "--tw-prose-body": "hsl(var(--textColor))",
        }}
      >
        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
      </Text>
    );
  }

  return (
    <div>
      <div>
        {contentSections.map((section, index) => {
          const lines = section.split("\n");
          const heading = lines[0].replace("## ", "");
          const sectionContent = lines.slice(1).join("\n");

          return (
            <div
              key={index}
              className={cn("border-b border-textColor", {
                "border-transparent": index === contentSections.length - 1,
              })}
            >
              <FieldsGroupContainer
                key={index}
                stage={
                  skipFirstSectionNumber && index === 0
                    ? ""
                    : String(
                        skipFirstSectionNumber ? index : index + 1,
                      ).padStart(2, "0")
                }
                title={heading}
                isOpen={openSection === index}
                onToggle={() => toggleSection(index)}
                clickableAreaClassName="w-full"
              >
                <Text
                  component="span"
                  className="prose max-w-none"
                  style={{
                    "--tw-prose-bullets": "hsl(var(--textColor))",
                    "--tw-prose-counters": "hsl(var(--textColor))",
                    "--tw-prose-headings": "hsl(var(--textColor))",
                    "--tw-prose-body": "hsl(var(--textColor))",
                  }}
                >
                  <ReactMarkdown components={markdownComponents}>
                    {sectionContent}
                  </ReactMarkdown>
                </Text>
              </FieldsGroupContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}
