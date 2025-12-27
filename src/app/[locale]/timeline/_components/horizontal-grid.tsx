"use client";

import Link from "next/link";
import type { common_ArchiveList } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function HorizontalGrid({
  archives,
}: {
  archives: common_ArchiveList[];
}) {
  const { languageId } = useTranslationsStore((state) => state);

  return (
    <div className="h-full px-2.5 pb-2.5 pt-14 lg:px-7 lg:pt-24">
      <div className="grid grid-cols-3 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-10">
        {archives.map((archive, index) => {
          const currentTranslation =
            archive?.translations?.find((t) => t.languageId === languageId) ||
            archive?.translations?.[0];

          return (
            <Link
              href={archive.slug || ""}
              key={archive.id}
              className="group block aspect-square space-y-2 border border-transparent hover:scale-105 hover:border-textColor"
            >
              <div className="hidden justify-between px-2 pt-2 lowercase text-textColor group-hover:flex">
                <Text>{archive.tag}</Text>
                <Text>{archive.createdAt?.split("T")[0]}</Text>
              </div>
              <div className="relative group-hover:scale-75">
                <ImageComponent
                  alt={currentTranslation?.heading + " " + index}
                  src={archive.thumbnail?.media?.fullSize?.mediaUrl || ""}
                  aspectRatio="1/1"
                  fit="scale-down"
                />
              </div>
              <div>
                <Text className="text-highlightColor group-hover:pb-2 group-hover:pl-2 group-hover:text-textColor">
                  {currentTranslation?.heading}
                </Text>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
