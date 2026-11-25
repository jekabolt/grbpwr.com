import Link from "next/link";
import type {
  common_ArchiveFull,
  common_MediaFull,
} from "@/api/proto-http/frontend";

import { calculateAspectRatio, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

// Flattens the archive's media-carrying blocks (main media, media lines and
// captioned media) into an ordered strip of media for the hero preview card.
function collectArchiveMedia(
  archive: common_ArchiveFull | undefined,
): common_MediaFull[] {
  const media: common_MediaFull[] = [];
  for (const it of archive?.items ?? []) {
    switch (it.type) {
      case "ARCHIVE_ITEM_TYPE_MAIN_MEDIA":
        if (it.mainMedia?.media?.media) media.push(it.mainMedia.media);
        break;
      case "ARCHIVE_ITEM_TYPE_MEDIA_LINE":
        for (const m of it.mediaLine?.media ?? []) if (m.media) media.push(m);
        break;
      case "ARCHIVE_ITEM_TYPE_MEDIA_WITH_CAPTION":
        if (it.mediaWithCaption?.media?.media)
          media.push(it.mediaWithCaption.media);
        break;
    }
  }
  return media;
}

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
          {collectArchiveMedia(archive).map((m, id) => (
            <div key={m.id ?? id} className={cn("group relative", className)}>
              <Image
                src={m.media?.fullSize?.mediaUrl || ""}
                alt="archive item"
                aspectRatio={calculateAspectRatio(
                  m.media?.fullSize?.width,
                  m.media?.fullSize?.height,
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
