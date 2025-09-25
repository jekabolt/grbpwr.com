"use client";

import { useRef } from "react";
import { CountryOption } from "@/constants";
import { useTranslations } from "next-intl";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useLocation } from "@/app/[locale]/_components/useLocation";

import { Banner } from "./banner";
import { Button } from "./button";
import { Text } from "./text";

type Props = {
  selectedLocation: CountryOption;
  onCancel: () => void;
};

export function UpdateLocation({ selectedLocation, onCancel }: Props) {
  const { country: currentCountry } = useTranslationsStore((state) => state);
  const { handleCountrySelect } = useLocation();
  const t = useTranslations("update_location");
  const initialCountryName = useRef(currentCountry.name);

  return (
    <Banner>
      <div className="flex flex-col gap-y-4 p-2.5">
        <Text className="uppercase">
          {t("message", { currentCountry: initialCountryName.current })}
        </Text>
        <div className="flex items-center">
          <Button
            variant="main"
            size="lg"
            className="w-full uppercase"
            onClick={() => handleCountrySelect(selectedLocation)}
          >
            {t("continue", { country: selectedLocation.name })}
          </Button>
          <Button
            variant="simpleReverse"
            size="lg"
            className="w-full uppercase"
            onClick={onCancel}
          >
            {t("cancel")}
          </Button>
        </div>
      </div>
    </Banner>
  );
}
