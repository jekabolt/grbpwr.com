import { common_HeroInsert } from "@/api/proto-http/frontend";
import Image from "next/image";

export default function AdsSection({
  ads,
}: {
  ads: common_HeroInsert[] | undefined;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ads?.map((a) =>
        a.contentLink ? (
          <div key={a.contentLink} className="relative col-span-1 h-[600px]">
            <Image
              src={a.contentLink || ""}
              alt="ad hero image"
              fill
              className="object-cover"
            />
          </div>
        ) : null,
      )}
    </div>
  );
}
