import { notFound } from "next/navigation";

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

  if (!section) {
    notFound();
  }

  const account = await getStorefrontAccount();

  return (
    <FlexibleLayout displayFooter={false}>
      <div className="flex min-h-screen items-center justify-center lg:p-0">
        {account ? (
          <>
            <AccountMobileSectionPage account={account} section={section} />
            <div className="hidden w-full lg:block">
              <AccountSignedInSection account={account} />
            </div>
          </>
        ) : (
          <AccountLoginForm />
        )}
      </div>
    </FlexibleLayout>
  );
}
