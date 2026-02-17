"use client";

import type { GetHeroResponse } from "@/api/proto-http/frontend";
import { createContext, ReactNode, useContext } from "react";

const DataContext = createContext<GetHeroResponse>({
  hero: undefined,
  dictionary: undefined,
});

export function DataContextProvider({
  children,
  ...props
}: GetHeroResponse & { children: ReactNode }) {
  return <DataContext.Provider value={props}>{children}</DataContext.Provider>;
}

export const useDataContext = () => useContext(DataContext);
