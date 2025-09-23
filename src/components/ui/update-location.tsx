"use client";

import { CountryOption } from "@/constants";
import { useTranslations } from "next-intl";

import { useLocation } from "@/app/[locale]/_components/useLocation";

import { Banner } from "./banner";
import { Button } from "./button";
import { Text } from "./text";

type Props = {
  selectedLocation: CountryOption;
  currentCountry: string;
  onCancel: () => void;
};

export function UpdateLocation({
  currentCountry,
  selectedLocation,
  onCancel,
}: Props) {
  const { handleCountrySelect } = useLocation();
  const t = useTranslations("update_location");
  return (
    <Banner>
      <div className="flex flex-col p-2.5">
        <Text>{t("message", { currentCountry })}</Text>
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
