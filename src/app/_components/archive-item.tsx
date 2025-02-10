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
        <Link className={cn("flex h-full w-full")} href={archive?.slug || ""}>
          {archive?.media?.map((m, id) => (
            <div className={cn("group relative", className)}>
              <Image
                src={m.media?.fullSize?.mediaUrl || ""}
                alt="archive media"
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
