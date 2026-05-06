"use client";

import FlexibleLayout from "@/components/flexible-layout";

import { LegalNotices } from "./legal-notices";

export default function LegalNoticesPage() {
  return (
    <FlexibleLayout>
      <div className="flex h-full flex-col space-y-20 px-2.5 pb-20 pt-24 lg:flex-row lg:justify-between lg:py-24">
        <LegalNotices />
      </div>
    </FlexibleLayout>
  );
}
