import { getStorefrontAccount } from "@/lib/storefront-account/get-storefront-account";
import FlexibleLayout from "@/components/flexible-layout";

import { AccountSignedInSection } from "./account-signed-in-section";
import { AccountLoginForm } from "./authorization/account-login-form";

export default async function AccountPage() {
  const account = await getStorefrontAccount();

  return (
    <FlexibleLayout>
      <div className="flex h-screen items-center justify-center">
        {account ? (
          <AccountSignedInSection account={account} />
        ) : (
          <AccountLoginForm />
        )}
      </div>
    </FlexibleLayout>
  );
}
