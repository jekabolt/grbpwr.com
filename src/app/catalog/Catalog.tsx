"use client";

import { common_Product } from "@/api/proto-http/frontend";
import ProductsSection from "@/components/sections/ProductsGridSection";
import { serviceClient } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Catalog({
  firstPageItems,
}: {
  firstPageItems: common_Product[];
}) {
  const [items, setItems] = useState<common_Product[]>(firstPageItems);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 16;

  const fetchData = async () => {
    if (!hasMore) return;
    setIsLoading(true);
    console.log(page);
    try {
      const response = await serviceClient.GetProductsPaged({
        limit: limit,
        offset: (page - 1) * limit,
        sortFactors: undefined,
        orderFactor: undefined,
        filterConditions: undefined,
      });

      setPage((prevPage) => prevPage + 1);
      setItems((prevItems) => [...prevItems, ...(response.products || [])]);
      if (!response.products || response.products.length < limit) {
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
  }, [page, hasMore]);

  return (
    <div>
      <ProductsSection products={items} />
      {/* use isLoading to show some spinner */}
    </div>
  );
}
