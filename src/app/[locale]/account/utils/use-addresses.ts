"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { StorefrontSavedAddress } from "@/api/proto-http/frontend";

import { setDefaultAddressRequest } from "./address-actions";
import { parseApiError } from "./api-error";

type Options = {
  enabled?: boolean;
  refreshKey?: number;
};

export function useAddresses({ enabled = true, refreshKey }: Options = {}) {
  const [pending, setPending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [addresses, setAddresses] = useState<StorefrontSavedAddress[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [defaultId, setDefaultId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadAddresses = useCallback(async () => {
    setPending(true);
    try {
      const res = await fetch("/api/account/addresses", { method: "GET" });
      if (!res.ok) {
        setToastMessage(await parseApiError(res, "failed to load addresses"));
        setAddresses([]);
        return;
      }
      const data = (await res.json().catch(() => ({}))) as {
        addresses?: StorefrontSavedAddress[];
      };
      setToastMessage(null);
      setAddresses(Array.isArray(data.addresses) ? data.addresses : []);
    } finally {
      setPending(false);
      setLoaded(true);
    }
  }, []);

  async function handleDefaultAddress(id: number) {
    setDefaultId(id);
    try {
      const result = await setDefaultAddressRequest(id);
      if (!result.ok) {
        setToastMessage(result.error);
        return;
      }
      setToastMessage(null);
      await loadAddresses();
    } finally {
      setDefaultId(null);
    }
  }

  async function handleDeleteAddress(id: number) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setToastMessage(await parseApiError(res, "failed to delete address"));
        return;
      }
      setToastMessage(null);
      setAddresses((prev) => prev.filter((address) => address.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    if (!enabled) {
      setAddresses([]);
      setLoaded(true);
      return;
    }
    void loadAddresses();
  }, [enabled, refreshKey, loadAddresses]);

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) ?? addresses[0],
    [addresses],
  );

  return {
    pending,
    loaded,
    addresses,
    defaultAddress,
    defaultId,
    deletingId,
    toastMessage,
    reload: loadAddresses,
    handleDefaultAddress,
    handleDeleteAddress,
  };
}
