"use client";

import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import { CollapsibleSections } from "../legal-notices/_components/collapsible-sections";
import { useMarkdownContent } from "../legal-notices/_components/use-markdown-content";

export default function FaqPage() {
  const { content } = useMarkdownContent("/content/faq/faq.md");
  return (
    <FlexibleLayout>
      <div className="h-full px-2.5 pt-8 lg:px-28 lg:pt-32">
        <div className="flex flex-col justify-start gap-y-10 lg:w-1/2 lg:gap-y-20">
          <div className="space-y-8">
            <Text variant="uppercase">frequently asked questions</Text>
            <Text>
              placing an order, order tracking, returns policy, aftersale
              services and sustainable development.
            </Text>
          </div>
          <CollapsibleSections content={content} />
        </div>
      </div>
    </FlexibleLayout>
  );
}
