import { common_OrderFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { parseApiError } from "./api-error";

const PAGE_SIZE = 10;

export function useOrders() {
    const t = useTranslations("account");
    const [allOrders, setAllOrders] = useState<common_OrderFull[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const fetchPage = useCallback(async (offset: number) => {
        if (offset === 0) setLoading(true);
        else setLoadingMore(true);
        try {
            const res = await fetch(
                `/api/account/orders?limit=${PAGE_SIZE}&offset=${offset}`,
            );
            if (!res.ok) {
                setToastMessage(
                    await parseApiError(res, t("failed to load orders")),
                );
                setToastOpen(true);
                return;
            }
            const data = (await res.json().catch(() => ({}))) as {
                orders?: common_OrderFull[];
                total?: number;
            };
            const page = Array.isArray(data.orders) ? data.orders : [];
            setAllOrders((prev) => (offset === 0 ? page : [...prev, ...page]));
            if (data.total !== undefined) setTotal(data.total);
        } catch {
            setToastMessage(t("failed to load orders"));
            setToastOpen(true);
        } finally {
            if (offset === 0) setLoading(false);
            else setLoadingMore(false);
        }
    }, [t]);

    useEffect(() => {
        void fetchPage(0);
    }, [fetchPage]);

    const loadMore = useCallback(() => {
        void fetchPage(allOrders.length);
    }, [fetchPage, allOrders.length]);

    return {
        allOrders,
        loading,
        loadingMore,
        hasMore: allOrders.length < total,
        loadMore,
        toastOpen,
        toastMessage,
        setToastOpen,
    };
}
