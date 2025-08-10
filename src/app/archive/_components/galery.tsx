"use client";

import { useEffect } from "react";
import type {
  common_ArchiveList,
  GetArchivesPagedResponse,
} from "@/api/proto-http/frontend";
import { ARCHIVE_LIMIT } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { useServerActionsContext } from "@/components/contexts/ServerActionsContext";

import { ViewMode } from "./archive-layout";
import { HorizontalGrid } from "./horizontal-grid";
import { VerticalCarousel } from "./vertical-carousel";

export function Galery({
  archives,
  total,
  viewMode,
}: {
  archives: common_ArchiveList[];
  total: number;
  viewMode: ViewMode;
}) {
  const { GetArchivesPaged } = useServerActionsContext();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<GetArchivesPagedResponse>({
      queryKey: ["archives"],
      queryFn: ({ pageParam }) =>
        GetArchivesPaged({
          limit: ARCHIVE_LIMIT,
          offset: pageParam as number,
          orderFactor: "ORDER_FACTOR_UNKNOWN",
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const totalFetched = allPages.reduce(
          (acc, page) => acc + (page.archives?.length || 0),
          0,
        );

        return totalFetched < (lastPage.total || 0) ? totalFetched : undefined;
      },
      initialData: {
        pages: [{ archives, total }],
        pageParams: [0],
      },
    });

  const items = data?.pages.flatMap((page) => page.archives || []) || [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full pt-14 lg:pt-24">
      {viewMode === "horizontal" ? (
        <HorizontalGrid archives={items} />
      ) : (
        <VerticalCarousel archives={items} />
      )}
      {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
    </div>
  );
}
