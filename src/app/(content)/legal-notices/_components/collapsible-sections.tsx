"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import FieldsGroupContainer from "@/app/(checkout)/checkout/_components/new-order-form/fields-group-container";

import { createMarkdownComponents } from "./markdown-components";

export function CollapsibleSections({
  content,
  skipFirstSectionNumber = false,
  showDirectly = false,
  onSectionChange,
}: {
  content: string;
  skipFirstSectionNumber?: boolean;
  showDirectly?: boolean;
  onSectionChange?: (section: string) => void;
}) {
  const [openSection, setOpenSection] = useState<number | null>(null);

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
        className="prose-headings:text-foreground prose-p:text-foreground prose max-w-none"
        style={{
          "--tw-prose-bullets": "hsl(var(--foreground))",
          "--tw-prose-counters": "hsl(var(--foreground))",
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
                clickableArea="full"
              >
                <Text
                  component="span"
                  className="prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose max-w-none"
                  style={{
                    "--tw-prose-bullets": "hsl(var(--foreground))",
                    "--tw-prose-counters": "hsl(var(--foreground))",
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
