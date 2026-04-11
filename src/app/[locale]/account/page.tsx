import { getStorefrontAccount } from "@/lib/storefront-account/get-storefront-account";
import FlexibleLayout from "@/components/flexible-layout";

import { AccountLoginForm } from "./account-login-form";
import { AccountSignedInSection } from "./account-signed-in-section";

export default async function AccountPage() {
  const account = await getStorefrontAccount();

  return (
    <FlexibleLayout>
      <div className="h-screen justify-center px-2.5 lg:py-24">
        {account ? (
          <AccountSignedInSection account={account} />
        ) : (
          <AccountLoginForm />
        )}
      </div>
    </FlexibleLayout>
  );
}
