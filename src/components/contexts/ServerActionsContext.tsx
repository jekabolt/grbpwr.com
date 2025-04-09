"use client";

import { createContext, ReactNode, useContext } from "react";
import type {
  GetArchivesPagedRequest,
  GetArchivesPagedResponse,
} from "@/api/proto-http/frontend";

type ServerActionsContextType = {
  GetArchivesPaged: (
    request: GetArchivesPagedRequest,
  ) => Promise<GetArchivesPagedResponse>;
};

const ServerActionsContext = createContext<ServerActionsContextType>({
  GetArchivesPaged: () => Promise.resolve({ archives: [], total: 0 }),
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
