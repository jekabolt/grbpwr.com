"use client";

import { common_Product } from "@/api/proto-http/frontend";

import Catalog from "./catalog";
import { MobileCatalog } from "./mobile-catalog";

interface ClientCatalogWrapperProps {
  firstPageItems: common_Product[];
  total: number;
}

export function ClientCatalogWrapper({
  firstPageItems,
  total,
}: ClientCatalogWrapperProps) {
  return (
    <>
      <div className="block lg:hidden">
        <MobileCatalog firstPageItems={firstPageItems} total={total} />
      </div>
      <div className="hidden lg:block">
        <Catalog total={total} firstPageItems={firstPageItems} />
      </div>
    </>
  );
}
