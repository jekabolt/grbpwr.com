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
    <FlexibleLayout theme={isWebsiteEnabled ? "light" : "dark"} accountPanel>
      <div className="flex min-h-dvh w-full items-center justify-center bg-bgColor px-2.5 text-textColor lg:p-0">
        {account ? (
          <AccountSignedInSection account={account} />
        ) : (
          <AccountLoginForm />
        )}
      </div>
    </FlexibleLayout>
  );
}
