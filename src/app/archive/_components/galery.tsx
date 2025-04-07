"use client";

import { useEffect, useRef, useState } from "react";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";
import { ARCHIVE_LIMIT } from "@/constants";
import { useInView } from "react-intersection-observer";

import { serviceClient } from "@/lib/api";

import { ViewMode } from "../page";
import { HorizontalGrid } from "./horizontal-grid";
import { VerticalCarousel } from "./vertical-carousel";

export function Galery({
  archives,
  viewMode,
  total,
}: {
  archives: common_ArchiveFull[];
  viewMode: ViewMode;
  total: number;
}) {
  const [items, setItems] = useState<common_ArchiveFull[]>(archives);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();
  const pageRef = useRef(2);
  const hasMoreRef = useRef(total >= ARCHIVE_LIMIT);

  useEffect(() => {
    setItems(archives);
    hasMoreRef.current = total >= ARCHIVE_LIMIT;
    pageRef.current = 2;
    setIsLoading(false);
  }, [archives, total]);

  const loadMoreData = async () => {
    if (!hasMoreRef.current || isLoading) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await serviceClient.GetArchivesPaged({
        limit: ARCHIVE_LIMIT,
        offset: (pageRef.current - 1) * ARCHIVE_LIMIT,
        orderFactor: "ORDER_FACTOR_UNKNOWN",
      });

      pageRef.current += 1;
      setItems((prevItems) => [...prevItems, ...(response.archives || [])]);
      if (!response.archives || response.archives.length < ARCHIVE_LIMIT) {
        hasMoreRef.current = false;
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMoreRef.current) {
      loadMoreData();
    }
  }, [inView, loadMoreData]);

  return (
    <div className="min-h-screen w-full">
      <div className="relative h-full">
        {viewMode === "horizontal" ? (
          <HorizontalGrid archives={items} isLoading={isLoading} />
        ) : (
          <VerticalCarousel archives={items} />
        )}
        <div className="space-y-4">
          {hasMoreRef.current && <div ref={ref} />}
        </div>
      </div>
    </div>
  );
}
