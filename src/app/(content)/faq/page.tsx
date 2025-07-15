"use client";

import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import { CollapsibleSections } from "../_components/collapsible-sections";
import { useMarkdownContent } from "../_components/use-markdown-content";

export default function FaqPage() {
  const { content } = useMarkdownContent("/content/faq/faq.md");
  return (
    <FlexibleLayout footerType="mini">
      <div className="h-full space-y-12 px-2.5 pt-8 lg:space-y-16 lg:px-28 lg:pt-24">
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
