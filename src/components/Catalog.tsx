"use client";

import type { common_Product } from "@/api/proto-http/frontend";
import ProductsSection from "@/components/sections/ProductsGridSection";
import { catalogLimit } from "@/constants";
import { serviceClient } from "@/lib/api";
import { useEffect, useRef, useState } from "react";

export default function Catalog({
  firstPageItems,
}: {
  firstPageItems: common_Product[];
}) {
  const [items, setItems] = useState<common_Product[]>(firstPageItems);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(2);
  const hasMoreRef = useRef(hasMore);

  const fetchData = async () => {
    if (!hasMoreRef.current || isLoading) return;
    setIsLoading(true);
    try {
      const response = await serviceClient.GetProductsPaged({
        limit: catalogLimit,
        offset: (pageRef.current - 1) * catalogLimit,
        sortFactors: undefined,
        orderFactor: undefined,
        filterConditions: undefined,
      });

      pageRef.current += 1;
      setItems((prevItems) => [...prevItems, ...(response.products || [])]);
      // To-DO we don't have count of all products on response, so last request could has 16 so we will make additional request that makes no sense - fix
      if (!response.products || response.products.length < catalogLimit) {
        hasMoreRef.current = false;
        setHasMore(false);
      }
    } catch (error) {
      // TO-DO show some sooner here that error happened ?
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    fetchData();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  return (
    <div>
      <ProductsSection products={items} />
      {/* use isLoading to show some spinner */}
    </div>
  );
}
