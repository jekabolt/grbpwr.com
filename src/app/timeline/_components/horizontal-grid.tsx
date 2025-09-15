"use client";

import Link from "next/link";
import type { common_ArchiveList } from "@/api/proto-http/frontend";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculateAspectRatio } from "@/lib/utils";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function HorizontalGrid({
  archives,
}: {
  archives: common_ArchiveList[];
}) {
  const { selectedLanguage } = useCurrency((state) => state);
  return (
    <div className="h-full px-2.5 pb-2.5 pt-14 lg:px-7 lg:pt-24">
      <div className="grid grid-cols-3 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-10">
        {archives.map((archive, index) => (
          <Link
            href={archive.slug || ""}
            key={archive.id}
            className="group block space-y-2"
          >
            <div className="relative">
              <ImageComponent
                alt={
                  archive.translations?.[selectedLanguage.id]?.heading +
                  " " +
                  index
                }
                src={archive.thumbnail?.media?.fullSize?.mediaUrl || ""}
                aspectRatio={calculateAspectRatio(
                  archive.thumbnail?.media?.fullSize?.width,
                  archive.thumbnail?.media?.fullSize?.height,
                )}
              />
            </div>
            <Text className="text-highlightColor group-hover:text-textColor">
              {archive.translations?.[selectedLanguage.id]?.heading}
            </Text>
          </Link>
        ))}
      </div>
    </div>
  );
}
