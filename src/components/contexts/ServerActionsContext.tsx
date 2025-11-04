"use client";

import { createContext, ReactNode, useContext } from "react";
import type {
  GetArchivesPagedRequest,
  GetArchivesPagedResponse,
  GetProductsPagedRequest,
  GetProductsPagedResponse,
} from "@/api/proto-http/frontend";

type ServerActionsContextType = {
  GetArchivesPaged: (
    request: GetArchivesPagedRequest,
  ) => Promise<GetArchivesPagedResponse>;
  GetProductsPaged: (
    request: GetProductsPagedRequest,
  ) => Promise<GetProductsPagedResponse>;
};

const ServerActionsContext = createContext<ServerActionsContextType>({
  GetArchivesPaged: () => Promise.resolve({ archives: [], total: 0 }),
  GetProductsPaged: () => Promise.resolve({ products: [], total: 0 }),
});

export function ServerActionsContextProvider({
  children,
  ...props
}: ServerActionsContextType & { children: ReactNode }) {
  return (
    <ServerActionsContext.Provider value={props}>
      {children}
    </ServerActionsContext.Provider>
  );
}

export const useServerActionsContext = () => useContext(ServerActionsContext);
