"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { StorefrontSavedAddress } from "@/api/proto-http/frontend";

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
      const data = (await res.json().catch(() => ({}))) as {
        addresses?: StorefrontSavedAddress[];
        error?: string;
      };
      if (!res.ok) {
        setToastMessage(data.error || "failed to load addresses");
        setAddresses([]);
        return;
      }
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
      const res = await fetch(`/api/account/addresses/${id}/default`, {
        method: "POST",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setToastMessage(data.error || "failed to set default address");
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
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setToastMessage(data.error || "failed to delete address");
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
