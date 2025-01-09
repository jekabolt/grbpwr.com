import { common_Product } from "@/api/proto-http/frontend";

import Category from "@/app/catalog/_components/Category";
import { InfinityScrollCatalog } from "@/app/catalog/_components/infinity-scroll-catalog";

import { MobileSize } from "./mobile-size";
import { MobileSort } from "./mobile-sort";

export function MobileCatalog({
  firstPageItems,
  total,
}: {
  firstPageItems: common_Product[];
  total: number;
}) {
  return (
    <div className="flex flex-col space-y-5 p-2">
      <div className="flex justify-start py-4">
        <Category />
      </div>
      <div className="sticky top-0 z-50 flex w-full justify-between bg-bgColor py-3">
        <MobileSort />
        <MobileSize />
      </div>
      <InfinityScrollCatalog total={total} firstPageItems={firstPageItems} />
    </div>
  );
}
