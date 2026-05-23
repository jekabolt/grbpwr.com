"use client";

import { useDataContext } from "@/components/contexts/DataContext";
import FlexibleLayout from "@/components/flexible-layout";

import { LegalNotices } from "./legal-notices";

export default function LegalNoticesPage() {
  const { dictionary } = useDataContext();
  const isWebsiteEnabled = dictionary?.siteEnabled;
  return (
    <FlexibleLayout theme={isWebsiteEnabled ? "light" : "dark"}>
      <div className="flex flex-col px-2.5 pb-20 pt-24 lg:flex-row lg:py-24 lg:pl-40 lg:pr-20">
        <LegalNotices />
      </div>
    </FlexibleLayout>
  );
}
