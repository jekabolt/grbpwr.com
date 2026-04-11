"use client";

import { useRouter } from "next/navigation";
import type { StorefrontAccount } from "@/api/proto-http/frontend";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type Props = {
  account: StorefrontAccount;
};

export function AccountSessionPanel({ account }: Props) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/account/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      <Text variant="uppercase">signed in</Text>

      <Text variant="uppercase" className="break-all text-center">
        {account.email ?? ""}
      </Text>

      <p>{account.phone ?? ""}</p>

      <Button
        type="button"
        variant="main"
        size="lg"
        className="w-full"
        onClick={logout}
      >
        log out
      </Button>
    </div>
  );
}
