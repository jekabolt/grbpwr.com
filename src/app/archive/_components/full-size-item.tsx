import Link from "next/link";
import { common_ArchiveList } from "@/api/proto-http/frontend";

import { calculateAspectRatio, cn } from "@/lib/utils";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

interface Props {
  className?: string;
  archive?: common_ArchiveList;
  highlightedItem?: boolean;
}

export function FullSizeItem({ className, archive, highlightedItem }: Props) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-between gap-4 text-textColor lg:flex-row",
        {
          "justify-center": !highlightedItem,
        },
      )}
    >
      {highlightedItem && (
        <Text className="w-60 text-center lg:text-left">
          {archive?.heading}
        </Text>
      )}
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
      {highlightedItem && (
        <Text className="w-60 text-center lg:text-right">{archive?.tag}</Text>
      )}
    </div>
  );
}
