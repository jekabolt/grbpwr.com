import { notFound } from "next/navigation";

import { serviceClient } from "@/lib/api";
import { getStorefrontAccount } from "@/lib/storefront-account/get-storefront-account";
import FlexibleLayout from "@/components/flexible-layout";

import { AccountMobileSectionPage } from "../_components/mobile-section-page";
import { AccountSignedInSection } from "../account-signed-in-section";
import { AccountLoginForm } from "../authorization/account-login-form";
import { getAccountSectionByPath } from "../utils/utility";

type Props = {
  params: Promise<{ section: string }>;
};

export default async function AccountSectionPage({ params }: Props) {
  const { section: sectionPath } = await params;
  const section = getAccountSectionByPath(sectionPath);
  const { dictionary } = await serviceClient.GetHero({});
  const isWebsiteEnabled = dictionary?.siteEnabled;

  if (!section) {
    notFound();
  }

  const account = await getStorefrontAccount();

  return (
    <FlexibleLayout
      theme={isWebsiteEnabled ? "light" : "dark"}
      accountPanel
      fillViewport
      displayFooter={!account}
    >
      <div className="flex h-dvh min-h-0 flex-col bg-bgColor px-2.5 text-textColor lg:max-h-dvh lg:overflow-hidden lg:p-0">
        {account ? (
          <>
            <AccountMobileSectionPage account={account} section={section} />
            <div className="hidden min-h-0 w-full flex-1 lg:flex">
              <AccountSignedInSection account={account} />
            </div>
          </>
        ) : (
          <div className="flex min-h-0 w-full flex-1">
            <AccountLoginForm />
          </div>
        )}
      </div>
    </FlexibleLayout>
  );
}
