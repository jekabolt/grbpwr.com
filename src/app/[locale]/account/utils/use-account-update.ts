"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { parseApiError } from "@/app/[locale]/account/utils/api-error";
import type { AccountSchema } from "@/app/[locale]/account/utils/schema";

import {
  buildAccountUpdatePayload,
  type AccountUpdateContext,
} from "./utility";

type AccountUpdateMode = "full" | "personal" | "email";

type UpdateAccountParams = {
  data: AccountSchema;
  context: AccountUpdateContext;
  mode: AccountUpdateMode;
  refresh?: boolean;
};

type UpdateAccountResult = {
  ok: boolean;
  error?: string;
};

export function useAccountUpdate() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const updateAccount = useCallback(
    async ({
      data,
      context,
      mode,
      refresh = true,
    }: UpdateAccountParams): Promise<UpdateAccountResult> => {
      setPending(true);
      try {
        const payload = buildAccountUpdatePayload(data, context, mode);
        const res = await fetch("/api/account/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const error = await parseApiError(res, "failed to update account");
          setToastMessage(error);
          setToastOpen(true);
          return { ok: false, error };
        }

        setToastOpen(false);
        if (refresh) router.refresh();
        return { ok: true };
      } finally {
        setPending(false);
      }
    },
    [router],
  );

  return {
    pending,
    toastOpen,
    toastMessage,
    setToastOpen,
    updateAccount,
  };
}
