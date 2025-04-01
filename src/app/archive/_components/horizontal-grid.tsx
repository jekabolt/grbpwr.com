"use client";

import Link from "next/link";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function HorizontalGrid({
  archives,
}: {
  archives: common_ArchiveFull[];
}) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-wrap gap-x-2 gap-y-6 lg:gap-x-4 lg:gap-y-10">
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
      </div>
    </div>
  );
}
