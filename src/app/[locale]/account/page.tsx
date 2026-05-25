import { serviceClient } from "@/lib/api";
import { getStorefrontAccount } from "@/lib/storefront-account/get-storefront-account";
import FlexibleLayout from "@/components/flexible-layout";

import { AccountSignedInSection } from "./account-signed-in-section";
import { AccountLoginForm } from "./authorization/account-login-form";

export default async function AccountPage() {
  const account = await getStorefrontAccount();
  const { dictionary } = await serviceClient.GetHero({});
  const isWebsiteEnabled = dictionary?.siteEnabled;

  return (
    <FlexibleLayout
      theme={isWebsiteEnabled ? "light" : "dark"}
      accountPanel
      fillViewport
      displayFooter={!!account}
    >
      <div className="flex h-dvh min-h-0 flex-col bg-bgColor px-2.5 lg:max-h-dvh lg:overflow-hidden lg:p-0">
        {account ? (
          <div className="flex min-h-0 w-full flex-1">
            <AccountSignedInSection account={account} />
          </div>
        ) : (
          <div className="flex min-h-0 w-full flex-1">
            <AccountLoginForm />
          </div>
        )}
      </div>
    </FlexibleLayout>
  );
}
