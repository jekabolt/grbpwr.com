// "use client";

// import { createContext, ReactNode, useContext } from "react";
// import type { GetHeroResponse } from "@/api/proto-http/frontend";

// const ServerActionsContext = createContext<GetHeroResponse>({});

// export function ServerActionsContextProvider({
//   children,
//   ...props
// }: GetHeroResponse & { children: ReactNode }) {
//   return (
//     <ServerActionsContext.Provider value={props}>
//       {children}
//     </ServerActionsContext.Provider>
//   );
// }

// export const useServerActionsContext = () => useContext(ServerActionsContext);
