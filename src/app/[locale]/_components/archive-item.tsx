import Link from "next/link";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";

import { calculateAspectRatio, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function ArchiveItem({
  archive,
  className,
}: {
  archive: common_ArchiveFull | undefined;
  className: string;
}) {
  return (
    <div className="relative">
      <Button asChild>
        <Link
          className={cn("flex h-full w-full")}
          href={archive?.archiveList?.slug || ""}
        >
          {archive?.items
            ?.filter(
              (it) => it.type === "ARCHIVE_ITEM_TYPE_MEDIA" && it.media?.media,
            )
            .map((it, id) => (
              <div
                key={it.media?.id ?? id}
                className={cn("group relative", className)}
              >
                <Image
                  src={it.media?.media?.fullSize?.mediaUrl || ""}
                  alt="archive item"
                  aspectRatio={calculateAspectRatio(
                    it.media?.media?.fullSize?.width,
                    it.media?.media?.fullSize?.height,
                  )}
                  fit="contain"
                />
                <Text className="absolute right-4 top-1/2 block -translate-y-1/2 md:hidden md:group-hover:block">
                  {id}
                </Text>
              </div>
            ))}
        </Link>
      </Button>
    </div>
  );
}
