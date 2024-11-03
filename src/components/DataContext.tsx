"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import type { GetHeroResponse } from "@/api/proto-http/frontend";

import { serviceClient } from "@/lib/api";

const DataContext = createContext<
  GetHeroResponse & {
    selectedCurrency: string;
    setSelectedCurrency: Dispatch<SetStateAction<string>>;
  }
>({
  hero: undefined,
  dictionary: undefined,
  rates: undefined,
  selectedCurrency: "",
  setSelectedCurrency: () => {},
});

export function DataContextProvider({
  children,
  ...props
}: GetHeroResponse & { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState(
    props.dictionary?.baseCurrency || "",
  );

  // const heroData = await serviceClient.GetHero({});

  // console.log("selectedCurrency", selectedCurrency);
  // }, []);
  // todo: add cart context

  return (
    <DataContext.Provider
      value={{ ...props, selectedCurrency, setSelectedCurrency }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => useContext(DataContext);
