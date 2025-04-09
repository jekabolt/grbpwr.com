"use client";

import { useEffect, useState } from "react";
import type {
  common_ArchiveFull,
  GetArchivesPagedResponse,
} from "@/api/proto-http/frontend";
import { ARCHIVE_LIMIT } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { useServerActionsContext } from "@/components/contexts/ServerActionsContext";
import { Button } from "@/components/ui/button";

import { HorizontalGrid } from "./horizontal-grid";
import { VerticalCarousel } from "./vertical-carousel";

type ViewMode = "horizontal" | "vertical";

export function Galery({
  archives,
  total,
}: {
  archives: common_ArchiveFull[];
  total: number;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("horizontal");
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

  const handleChangeView = () => {
    setViewMode(viewMode === "horizontal" ? "vertical" : "horizontal");
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-center gap-4">
        <Button onClick={handleChangeView}>change view</Button>
      </div>
      {viewMode === "horizontal" ? (
        <HorizontalGrid archives={items} />
      ) : (
        <VerticalCarousel archives={items} />
      )}
      {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
    </div>
  );
}
