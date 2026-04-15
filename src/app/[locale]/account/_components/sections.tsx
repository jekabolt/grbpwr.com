"use client";

import { EmailPreferences } from "@/app/[locale]/account/_components/email-preferences";

import type { ActivePanel } from "../utils/utility";
import { PersonalInfo } from "./personal-info";

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
