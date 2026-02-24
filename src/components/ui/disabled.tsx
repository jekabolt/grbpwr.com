"use client";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { useDataContext } from "../contexts/DataContext";
import FlexibleLayout from "../flexible-layout";
import { AnimatedButton } from "./animated-button";
import { Text } from "./text";

export function Disabled() {
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);
  const announce =
    dictionary?.announce?.translations?.find((t) => t.languageId === languageId)
      ?.text || "";
  const announceLink = dictionary?.announce?.link;
  return (
    <FlexibleLayout>
      <div className="absolute inset-0 flex h-screen w-full items-center justify-center">
        {announceLink ? (
          <AnimatedButton href={announceLink}>
            <Text variant="uppercase">{announce}</Text>
          </AnimatedButton>
        ) : (
          <Text variant="uppercase">{announce}</Text>
        )}
      </div>
    </FlexibleLayout>
  );
}
