"use client";

import { useEffect, useState } from "react";
import { common_GenderEnum, common_Product } from "@/api/proto-http/frontend";

import {
  getCategoryDescription,
  getTopCategoryName,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { EmptyCatalog } from "./empty-catalog";
import { InfinityScrollCatalog } from "./infinity-scroll-catalog";
import { useRouteParams } from "./useRouteParams";

export function MobileCatalog({
  firstPageItems,
  total,
}: {
  firstPageItems: common_Product[];
  total: number;
}) {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const { dictionary } = useDataContext();
  const { gender, topCategory } = useRouteParams();
  const activeTopCategory = getTopCategoryName(
    dictionary?.categories || [],
    parseInt(topCategory || "0"),
  );
  const categoryDescription = getCategoryDescription(
    activeTopCategory || "",
    gender as common_GenderEnum,
  );

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsFooterVisible(entry?.isIntersecting || false);
      },
      { threshold: 0 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    // <div className="flex flex-col space-y-6 border border-blue-500 px-2.5 pb-10 pt-2">
    //   {total > 0 ? (
    //     <div>
    //       <Text className="w-full lowercase">{categoryDescription}</Text>
    //       <InfinityScrollCatalog
    //         firstPageItems={firstPageItems}
    //         total={total}
    //       />
    //       <MobileFilter />
    //     </div>
    //   ) : (
    //     <div className="h-screen w-full">
    //       <EmptyCatalog />
    //     </div>
    //   )}
    // </div>
    <div className="relative">
      {total > 0 ? (
        <>
          <Text className="w-full lowercase">{categoryDescription}</Text>
          <InfinityScrollCatalog
            firstPageItems={firstPageItems}
            total={total}
          />
        </>
      ) : (
        <div className="h-screen w-full">
          <EmptyCatalog />
        </div>
      )}
      {!isFooterVisible && (
        <div className="bg-bgColor/80 fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 py-3 backdrop-blur">
          <Text className="uppercase">text</Text>
        </div>
      )}
    </div>
  );
}
