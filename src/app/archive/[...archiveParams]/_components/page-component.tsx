"use client";

import { common_ArchiveFull } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export default function PageComponent({
  archive,
}: {
  archive?: common_ArchiveFull;
}) {
  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Text variant="uppercase" className="text-sm">
          {archive?.heading || ""}
        </Text>
        <Text className="text-sm">{archive?.tag || ""}</Text>
      </div>

      {/* Main Media */}
      {archive?.media && archive?.media.length > 0 && (
        <div className="relative mb-12 h-[80vh] w-full">
          {archive?.media[0].media?.fullSize && (
            <ImageComponent
              src={archive?.media[0].media?.fullSize?.mediaUrl || ""}
              alt={archive?.heading || "Featured archive image"}
              aspectRatio={calculateAspectRatio(
                archive?.media[0].media?.fullSize?.width,
                archive?.media[0].media?.fullSize?.height,
              )}
            />
          )}
        </div>
      )}

      {/* Video Section */}
      {archive?.video && !!archive?.video.media?.fullSize?.mediaUrl && (
        <div className="mb-12 w-full">
          <div className="relative aspect-video w-full overflow-hidden">
            <video
              src={archive?.video.media.fullSize?.mediaUrl || ""}
              controls
              className="h-full w-full object-cover"
              poster={archive?.video.media.thumbnail?.mediaUrl}
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          {archive?.description && (
            <Text className="mt-4 text-sm opacity-80">
              {archive?.description}
            </Text>
          )}
        </div>
      )}

      {/* Image Grid */}
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {archive?.media?.slice(1).map((mediaItem, index) => (
          <div key={index} className="relative aspect-[3/4]">
            {mediaItem.media?.fullSize && (
              <ImageComponent
                src={mediaItem.media?.fullSize?.mediaUrl || ""}
                alt={`${archive?.heading || ""} image ${index + 1}`}
                aspectRatio={calculateAspectRatio(
                  mediaItem.media?.fullSize?.width,
                  mediaItem.media?.fullSize?.height,
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
