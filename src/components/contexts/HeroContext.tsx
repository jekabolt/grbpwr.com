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

const HeroContext = createContext<
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

export function HeroContextProvider({
  children,
  ...props
}: GetHeroResponse & { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState(
    props.dictionary?.baseCurrency || "",
  );

  return (
    <HeroContext.Provider
      value={{ ...props, selectedCurrency, setSelectedCurrency }}
    >
      {children}
    </HeroContext.Provider>
  );
}

export const useHeroContext = () => useContext(HeroContext);
