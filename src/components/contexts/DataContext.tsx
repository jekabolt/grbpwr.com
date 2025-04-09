"use client";

import { createContext, ReactNode, useContext } from "react";
import type { GetHeroResponse } from "@/api/proto-http/frontend";

const DataContext = createContext<GetHeroResponse>({
  hero: undefined,
  dictionary: undefined,
  rates: undefined,
});

export function DataContextProvider({
  children,
  ...props
}: GetHeroResponse & { children: ReactNode }) {
  return <DataContext.Provider value={props}>{children}</DataContext.Provider>;
}

export const useDataContext = () => useContext(DataContext);
