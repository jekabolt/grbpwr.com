"use server"

import type { common_ArchiveFull } from "@/api/proto-http/frontend";
import { ARCHIVE_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";

export const loadMoreArchiveData = async (offset: number): Promise<{
    archives: common_ArchiveFull[];
    total: number;
}> => {
    try {
        const response = await serviceClient.GetArchivesPaged({
            limit: ARCHIVE_LIMIT,
            offset,
            orderFactor: "ORDER_FACTOR_UNKNOWN",
        });

        return {
            archives: response.archives || [],
            total: response.total || 0,
        };
    } catch (error) {
        console.error("Failed to fetch archives via Server Action:", error);
        return { archives: [], total: 0 };
    }
}
