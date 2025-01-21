"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  common_CurrencyRate,
  GetHeroResponse,
} from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

const DataContext = createContext<
  GetHeroResponse & {
    selectedCurrency: string;
    setSelectedCurrency: Dispatch<SetStateAction<string>>;
    convertPrice: (amount: string | undefined) => string;
    getCurrencySymbol: () => string;
  }
>({
  hero: undefined,
  dictionary: undefined,
  rates: undefined,
  selectedCurrency: "",
  setSelectedCurrency: () => {},
  convertPrice: () => "",
  getCurrencySymbol: () => "",
});

const CURRENCY_STORAGE_KEY = "grbpwr-selected-currency";

function convertCurrency(
  amount: string | undefined,
  rates: { [key: string]: common_CurrencyRate } | undefined,
  targetCurrency: string,
): string {
  if (!amount || !rates || !targetCurrency) {
    return amount || "0";
  }

  const targetRate = rates[targetCurrency];

  if (!targetRate?.rate?.value) {
    return amount;
  }

  const baseAmount = parseFloat(amount);
  const rate = parseFloat(targetRate.rate.value);
  const convertedAmount = baseAmount * rate;

  return convertedAmount.toFixed(2);
}

// const heroData = await serviceClient.GetHero({});
// todo: add cart context
export function DataContextProvider({
  children,
  ...props
}: GetHeroResponse & { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem(CURRENCY_STORAGE_KEY) ||
        props.dictionary?.baseCurrency ||
        ""
      );
    }
    return props.dictionary?.baseCurrency || "";
  });

  useEffect(() => {
    if (selectedCurrency) {
      localStorage.setItem(CURRENCY_STORAGE_KEY, selectedCurrency);
    }
  }, [selectedCurrency]);

  function convertPrice(amount: string | undefined) {
    return convertCurrency(amount, props.rates?.currencies, selectedCurrency);
  }

  function getCurrencySymbol() {
    return currencySymbols[selectedCurrency] || selectedCurrency;
  }

  return (
    <DataContext.Provider
      value={{
        ...props,
        selectedCurrency,
        setSelectedCurrency,
        convertPrice,
        getCurrencySymbol,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => useContext(DataContext);
