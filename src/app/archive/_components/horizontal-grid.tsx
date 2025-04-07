"use client";

import Link from "next/link";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";
import { ARCHIVE_LIMIT } from "@/constants";

import { calculateAspectRatio } from "@/lib/utils";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { ProductSkeleton } from "@/app/catalog/_components/infinity-scroll-catalog";

export function HorizontalGrid({
  archives,
  isLoading,
}: {
  archives: common_ArchiveFull[];
  isLoading: boolean;
}) {
  return (
    <div className="w-full overflow-x-auto pt-20">
      <div className="grid grid-cols-3 gap-x-2 gap-y-6 lg:grid-cols-8 lg:gap-x-4 lg:gap-y-10">
        {archives.map((archive, index) => (
          <Link
            href={`/archive/${archive.id}`}
            key={archive.id}
            className="block space-y-2"
          >
            <div className="relative h-36 lg:h-56">
              <ImageComponent
                alt={archive.heading + " " + index}
                src={archive.media?.[0].media?.fullSize?.mediaUrl || ""}
                aspectRatio={calculateAspectRatio(
                  archive.media?.[0].media?.fullSize?.width,
                  archive.media?.[0].media?.fullSize?.height,
                )}
              />
            </div>
            <Text>{archive.heading}</Text>
          </Link>
        ))}
        {isLoading &&
          Array.from({ length: ARCHIVE_LIMIT }).map((_, index) => (
            <ProductSkeleton key={`skeleton-${index}`} />
          ))}
      </div>
    </div>
  );
}
