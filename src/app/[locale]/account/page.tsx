import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";
import { getStorefrontAccount } from "@/lib/storefront-account";

import { AccountLoginForm } from "./account-login-form";
import { AccountSessionPanel } from "./account-session-panel";

export default async function AccountPage() {
  const account = await getStorefrontAccount();

  return (
    <FlexibleLayout>
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-16">
        <div className="flex w-full max-w-lg flex-col items-center gap-10">
          <div className="space-y-4 text-center">
            <Text variant="uppercase">
              {account ? "account" : "login or create account"}
            </Text>
          </div>
          {account ? <AccountSessionPanel account={account} /> : <AccountLoginForm />}
        </div>
      </div>
    </FlexibleLayout>
  );
}
