import Catalog from "@/components/Catalog";
import CoreLayout from "@/components/layouts/CoreLayout";
import { catalogLimit } from "@/constants";
import { serviceClient } from "@/lib/api";

import Image from "@/components/global/Image";

export default async function Page() {
  const { archives } = await serviceClient.GetArchivesPaged({
    limit: 10,
    offset: 0,
    orderFactor: "ORDER_FACTOR_UNKNOWN",
  });

  const nonEmptyArchives = archives?.filter((v) => v.archive) || [];

  return (
    <div className="blueTheme">
      <CoreLayout>
        <div className="flex flex-col gap-14">
          {nonEmptyArchives?.map((a, i) => (
            <div key={a.archive?.id || i} className="text-textColor">
              <div className="flex gap-3">
                {/* todo: fix images. make sure all the images have known size + add scroll when there are more images  */}
                {a.items?.map((i) => (
                  <div key={i.id} className="h-80 w-80">
                    <Image
                      src={i.archiveItemInsert?.media || ""}
                      alt={i.archiveItemInsert?.title || ""}
                      aspectRatio="4/1"
                    />
                  </div>
                ))}
              </div>
              {/* todo: doublec check foint sizes for mobile */}
              <div className="text-md mb-4 mt-6 lg:text-xl">
                {a.archive?.archiveInsert?.heading}
              </div>
              <div className="flex justify-between gap-6">
                <p>{a.archive?.archiveInsert?.description}</p>
                <p>{a.archive?.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      </CoreLayout>
    </div>
  );
}
