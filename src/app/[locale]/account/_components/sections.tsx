"use client";

import { EmailPreferences } from "@/app/[locale]/account/sections/email-preferences";

import { PersonalInfo } from "../sections/personal-info";
import type { ActivePanel } from "../utils/utility";

type Props = {
  activePanel: ActivePanel;
  selectedCountryCode?: string;
};

export function ActiveAccountSection({
  activePanel,
  selectedCountryCode,
}: Props) {
  switch (activePanel) {
    case "personal":
      return <PersonalInfo selectedCountryCode={selectedCountryCode || ""} />;
    case "email":
      return <EmailPreferences />;
    default:
      return null;
  }
}
