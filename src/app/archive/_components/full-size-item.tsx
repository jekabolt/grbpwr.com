import Link from "next/link";
import { common_ArchiveFull } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

interface Props {
  className?: string;
  archive?: common_ArchiveFull;
}

export function FullSizeItem({ className, archive }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-y-9 bg-bgColor text-textColor lg:flex-row lg:gap-4">
      <Text className="w-60 text-center lg:text-left">{archive?.heading}</Text>
      <div className={className}>
        <Link href={archive?.slug || ""}>
          <ImageComponent
            src={archive?.media?.[0].media?.fullSize?.mediaUrl || ""}
            alt={archive?.heading || ""}
            aspectRatio={calculateAspectRatio(
              archive?.media?.[0].media?.fullSize?.width,
              archive?.media?.[0].media?.fullSize?.height,
            )}
          />
        </Link>
      </div>
      <Text className="w-60 text-center lg:text-right">{archive?.tag}</Text>
    </div>
  );
}
