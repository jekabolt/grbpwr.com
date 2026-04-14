import { getStorefrontAccount } from "@/lib/storefront-account/get-storefront-account";
import FlexibleLayout from "@/components/flexible-layout";

import { AccountLoginForm } from "./account-login-form";
import { AccountSignedInSection } from "./account-signed-in-section";

export default async function AccountPage() {
  const account = await getStorefrontAccount();

  return (
    <FlexibleLayout>
      <div className="flex h-screen items-center justify-center border border-red-500">
        {account ? (
          <AccountSignedInSection account={account} />
        ) : (
          <AccountLoginForm />
        )}
      </div>
    </FlexibleLayout>
  );
}
