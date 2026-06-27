import Link from "next/link";
import { useTranslations } from "next-intl";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";

import { calculateAspectRatio, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";

export function ArchiveItem({
  archive,
  className,
}: {
  archive: common_ArchiveFull | undefined;
  className: string;
}) {
  const t = useTranslations("meta");
  return (
    <div className="relative">
      <Button asChild>
        <Link
          className={cn("flex h-full w-full")}
          href={archive?.archiveList?.slug || ""}
        >
          {archive?.media?.map((m) => (
            <div key={m.id} className={cn("group relative", className)}>
              <Image
                src={m.media?.fullSize?.mediaUrl || ""}
                alt={t("archive image")}
                aspectRatio={calculateAspectRatio(
                  m.media?.fullSize?.width,
                  m.media?.fullSize?.height,
                )}
                fit="contain"
              />
            </div>
          ))}
        </Link>
      </Button>
    </div>
  );
}
