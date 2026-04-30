import { getStorefrontAccount } from "@/lib/storefront-account/get-storefront-account";
import FlexibleLayout from "@/components/flexible-layout";

import { AccountSignedInSection } from "./account-signed-in-section";
import { AccountLoginForm } from "./authorization/account-login-form";

export default async function AccountPage() {
  const account = await getStorefrontAccount();

  return (
    <FlexibleLayout displayFooter={false}>
      <div className="flex items-center justify-center px-2.5 pt-32 lg:h-screen lg:p-0">
        {account ? (
          <AccountSignedInSection account={account} />
        ) : (
          <AccountLoginForm />
        )}
      </div>
    </FlexibleLayout>
  );
}
