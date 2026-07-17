"use client";

import { createContext, ReactNode, useContext } from "react";
import type {
  GetArchivesPagedRequest,
  GetArchivesPagedResponse,
  GetColorwaysPagedRequest,
  GetColorwaysPagedResponse,
} from "@/api/proto-http/frontend";

type ServerActionsContextType = {
  GetArchivesPaged: (
    request: GetArchivesPagedRequest,
  ) => Promise<GetArchivesPagedResponse>;
  GetColorwaysPaged: (
    request: GetColorwaysPagedRequest,
  ) => Promise<GetColorwaysPagedResponse>;
};

const ServerActionsContext = createContext<ServerActionsContextType>({
  GetArchivesPaged: () => Promise.resolve({ archives: [], total: 0 }),
  GetColorwaysPaged: () => Promise.resolve({ colorways: [], total: 0 }),
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
