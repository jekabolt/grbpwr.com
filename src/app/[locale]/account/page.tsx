import { getStorefrontAccount } from "@/lib/storefront-account/get-storefront-account";
import FlexibleLayout from "@/components/flexible-layout";

import { AccountSignedInSection } from "./account-signed-in-section";
import { AccountLoginForm } from "./authorization/account-login-form";

export default async function AccountPage() {
  const account = await getStorefrontAccount();

  return (
    <FlexibleLayout displayFooter={false}>
      <div className="flex h-dvh min-h-0 flex-col px-2.5 lg:p-0">
        <div className="flex min-h-0 flex-1">
          {account ? (
            <AccountSignedInSection account={account} />
          ) : (
            <AccountLoginForm />
          )}
        </div>
      </div>
    </FlexibleLayout>
  );
}
