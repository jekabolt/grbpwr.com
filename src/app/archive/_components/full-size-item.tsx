import Link from "next/link";
import { common_ArchiveList } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

interface Props {
  className?: string;
  archive?: common_ArchiveList;
}

export function FullSizeItem({ className, archive }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-4 lg:flex-row">
      <Text className="w-60 text-center lg:text-left">{archive?.heading}</Text>
      <div className={className}>
        <Link href={archive?.slug || ""}>
          <ImageComponent
            src={archive?.thumbnail?.media?.fullSize?.mediaUrl || ""}
            alt={archive?.heading || ""}
            aspectRatio={calculateAspectRatio(
              archive?.thumbnail?.media?.fullSize?.width,
              archive?.thumbnail?.media?.fullSize?.height,
            )}
          />
        </Link>
      </div>
      <Text className="w-60 text-center lg:text-right">{archive?.tag}</Text>
    </div>
  );
}
