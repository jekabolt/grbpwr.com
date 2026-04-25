import { getStorefrontAccount } from "@/lib/storefront-account/get-storefront-account";
import FlexibleLayout from "@/components/flexible-layout";

import { AccountSignedInSection } from "./account-signed-in-section";
import { AccountLoginForm } from "./authorization/account-login-form";

export default async function AccountPage() {
  const account = await getStorefrontAccount();

  return (
    <FlexibleLayout displayFooter={!!account}>
      <div className="flex h-dvh items-center justify-center overflow-hidden lg:h-screen">
        {account ? (
          <AccountSignedInSection account={account} />
        ) : (
          <AccountLoginForm />
        )}
      </div>
    </FlexibleLayout>
  );
}
