"use client";

import { useEffect, useState } from "react";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";

import { HorizontalGrid } from "./horizontal-grid";
import { VerticalCarousel } from "./vertical-carousel";

type ViewMode = "horizontal" | "vertical";

type ArchivePage = {
  archives: common_ArchiveFull[];
  total: number;
};

export function Galery({
  archives,
  total,
  loadMoreArchiveData,
}: {
  archives: common_ArchiveFull[];
  total: number;
  loadMoreArchiveData: ({ pageParam }: QueryFunctionContext) => Promise<{
    archives: common_ArchiveFull[];
    total: number;
  }>;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("horizontal");
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<ArchivePage>({
      queryKey: ["archives"],
      queryFn: loadMoreArchiveData,
      initialPageParam: 0,
      getNextPageParam: (lastPage: ArchivePage, allPages: ArchivePage[]) => {
        const totalFetched = allPages.reduce(
          (acc: number, page: ArchivePage) => acc + page.archives.length,
          0,
        );
        return totalFetched < lastPage.total ? totalFetched : undefined;
      },
      initialData: {
        pages: [{ archives, total }],
        pageParams: [0],
      },
    });

  const items = data?.pages.flatMap((page) => page.archives) || [];

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
