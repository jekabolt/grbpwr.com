"use client";

import {
  common_Dictionary,
  common_HeroFull,
  common_Product,
} from "@/api/proto-http/frontend";

import { DataContextProvider } from "@/components/contexts/DataContext";

import Catalog from "./catalog";
import { MobileCatalog } from "./mobile-catalog";

interface ClientCatalogWrapperProps {
  firstPageItems: common_Product[];
  total: number;
  hero: common_HeroFull | undefined;
  dictionary: common_Dictionary | undefined;
}

export function ClientCatalogWrapper({
  firstPageItems,
  total,
  hero,
  dictionary,
}: ClientCatalogWrapperProps) {
  return (
    <DataContextProvider hero={hero} dictionary={dictionary} rates={undefined}>
      <div className="block lg:hidden">
        <MobileCatalog firstPageItems={firstPageItems} total={total} />
      </div>
      <div className="hidden lg:block">
        <Catalog total={total} firstPageItems={firstPageItems} />
      </div>
    </DataContextProvider>
  );
}
