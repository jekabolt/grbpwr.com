"use client";

import { useEffect, useRef, useState } from "react";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";
import { ARCHIVE_LIMIT } from "@/constants";
import { useInView } from "react-intersection-observer";

import { serviceClient } from "@/lib/api";
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
      const response = await serviceClient.GetArchivesPaged({
        limit: ARCHIVE_LIMIT,
        offset: (pageRef.current - 1) * ARCHIVE_LIMIT,
        orderFactor: "ORDER_FACTOR_UNKNOWN",
      });

      if (response && response.archives) {
        pageRef.current += 1;
        setItems((prevItems) => [...prevItems, ...(response.archives || [])]);

        const totalFetched = (pageRef.current - 1) * ARCHIVE_LIMIT;
        hasMoreRef.current = totalFetched < (response.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch archives:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMoreRef.current) {
      loadMoreData();
    }
  }, [inView, loadMoreData]);

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
      {hasMoreRef.current && <div ref={ref} />}
    </div>
  );
}
