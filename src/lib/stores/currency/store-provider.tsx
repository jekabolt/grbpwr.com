// "use client";

// import { createContext, useContext, useRef, type ReactNode } from "react";
// import { common_CurrencyRate } from "@/api/proto-http/frontend";
// import { useStore } from "zustand";

// import { createCurrencyStore, defaultInitState } from "./store";
// import { CurrencyStore } from "./store-types";

// type CurrencyStoreApi = ReturnType<typeof createCurrencyStore>;

// const CurrencyStoreContext = createContext<CurrencyStoreApi | undefined>(
//   undefined,
// );

// interface CurrencyStoreProviderProps {
//   rates: { [key: string]: common_CurrencyRate } | undefined;
// }

// export function CurrencyStoreProvider({
//   children,
//   rates,
// }: CurrencyStoreProviderProps & { children: ReactNode }) {
//   const storeRef = useRef<CurrencyStoreApi | null>(null);

//   if (!storeRef.current) {
//     storeRef.current = createCurrencyStore({
//       ...defaultInitState,
//       rates: rates || {},
//     });
//   }

//   return (
//     <CurrencyStoreContext.Provider value={storeRef.current}>
//       {children}
//     </CurrencyStoreContext.Provider>
//   );
// }

// export const useCurrency = <T,>(selector: (store: CurrencyStore) => T): T => {
//   const currencyStoreContext = useContext(CurrencyStoreContext);

//   if (!currencyStoreContext) {
//     throw new Error("useCurrency must be used within CurrencyStoreProvider");
//   }

//   return useStore(currencyStoreContext, selector);
// };
