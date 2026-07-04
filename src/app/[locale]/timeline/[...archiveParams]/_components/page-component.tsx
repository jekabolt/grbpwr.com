"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  common_ArchiveFull,
  common_ArchiveItemFull,
  common_MediaFull,
} from "@/api/proto-http/frontend";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import {
  calculateAspectRatio,
  cn,
  isVideo,
  resolveArchiveMedia,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { ArchiveMediaThumbnail } from "../../_components/archive-media-thumbnail";
import { ProductItem } from "../../../_components/product-item";

// Shared 2/4-col grid used by both the media run and the products blocks so the
// two stay visually identical.
const ARCHIVE_GRID_CLASS = "grid grid-cols-2 gap-2 md:grid-cols-4 lg:gap-4";

function ArchiveMediaGridItem({
  media: mediaFull,
  id,
  heading,
  blockIndex,
}: {
  media: common_MediaFull | undefined;
  id: number;
  heading: string;
  // items[] index of this tile — mirrors hero's data-hero-block-index. The
  // /preview editor reads it on click; inert on the live /timeline page.
  blockIndex: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const media = resolveArchiveMedia(mediaFull?.media);
  const isPriority = id < 4;
  const isVideoItem = media.type === "video";

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden"
      data-archive-block-index={blockIndex}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ArchiveMediaThumbnail
        media={media}
        alt={`${heading} image ${id + 1}`}
        aspectRatio="3/4"
        blurhash={mediaFull?.media?.blurhash}
        priority={isPriority}
        loading={isPriority ? "eager" : "lazy"}
        playOnHover={!isMobile && isVideoItem && isHovered}
        autoPlay={isMobile && isVideoItem}
      />
    </div>
  );
}

// Small uppercase label above a non-media block (product/products/embed caption).
function ArchiveCaption({ children }: { children: string }) {
  return (
    <Text variant="uppercase" className="text-textInactiveColor">
      {children}
    </Text>
  );
}

// EMBED block: a third-party iframe (Spline/3D/video). Mirrors the hero embed's
// attributes and reveal-on-load so a CSP-blocked or failed embed just stays
// blank instead of erroring. The origin must be allowlisted in the CSP
// `frame-src` (see next.config.ts) for it to render.
function ArchiveEmbed({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <iframe
        src={url}
        title={title || "grbpwr"}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture; xr-spatial-tracking; accelerometer; gyroscope"
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        className={cn(
          "absolute inset-0 h-full w-full border-0 transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

// One non-media timeline block. MEDIA is handled by the grid in <ArchiveBody>;
// everything else renders full-width here by composing the shared primitives.
function ArchiveItemBlock({
  item,
  heading,
  languageId,
}: {
  item: common_ArchiveItemFull;
  heading: string;
  languageId: number;
}) {
  const tr =
    item.translations?.find((t) => t.languageId === languageId) ||
    item.translations?.[0];
  const caption = tr?.caption;

  switch (item.type) {
    case "ARCHIVE_ITEM_TYPE_TEXT":
      return tr?.text ? (
        <div className="flex w-full items-center justify-center">
          <div className="w-full max-w-[640px]">
            <Text className="break-words text-justify lg:text-left">
              {tr.text}
            </Text>
          </div>
        </div>
      ) : null;
    case "ARCHIVE_ITEM_TYPE_EMBED":
      return item.embedUrl ? (
        <div className="space-y-2">
          <ArchiveEmbed url={item.embedUrl} title={caption || heading} />
          {caption && <ArchiveCaption>{caption}</ArchiveCaption>}
        </div>
      ) : null;
    case "ARCHIVE_ITEM_TYPE_PRODUCT":
      return item.product ? (
        <div className="space-y-2">
          {caption && <ArchiveCaption>{caption}</ArchiveCaption>}
          <div className="flex w-full justify-center">
            <div className="w-1/2 lg:w-1/4">
              <ProductItem product={item.product} className="w-full" />
            </div>
          </div>
        </div>
      ) : null;
    case "ARCHIVE_ITEM_TYPE_PRODUCTS_TAG":
    case "ARCHIVE_ITEM_TYPE_PRODUCTS_MANUAL":
      return item.products && item.products.length > 0 ? (
        <div className="space-y-2">
          {caption && <ArchiveCaption>{caption}</ArchiveCaption>}
          <div className={ARCHIVE_GRID_CLASS}>
            {item.products.map((p) => (
              <ProductItem key={p.id} product={p} className="w-full" />
            ))}
          </div>
        </div>
      ) : null;
    default:
      return null;
  }
}

// Renders the ordered, heterogeneous timeline body. Consecutive MEDIA blocks
// collapse into the familiar 2/4-col grid (so existing media-only archives look
// unchanged); every other block type renders full-width in document order,
// mirroring the hero's block list.
function ArchiveBody({
  items,
  heading,
  languageId,
}: {
  items: common_ArchiveItemFull[];
  heading: string;
  languageId: number;
}) {
  const blocks: ReactNode[] = [];
  let run: { item: common_ArchiveItemFull; index: number }[] = [];
  let mediaCount = 0;

  const flush = () => {
    if (run.length === 0) return;
    const start = mediaCount;
    const cells = run;
    blocks.push(
      <div key={`media-${start}`} className={ARCHIVE_GRID_CLASS}>
        {cells.map(({ item, index }, i) => (
          <ArchiveMediaGridItem
            key={item.media?.id ?? `${start}-${i}`}
            media={item.media}
            id={start + i}
            heading={heading}
            blockIndex={index}
          />
        ))}
      </div>,
    );
    mediaCount += run.length;
    run = [];
  };

  items.forEach((item, i) => {
    if (item.type === "ARCHIVE_ITEM_TYPE_MEDIA") {
      // Only renderable media joins the grid run; an empty/partial media block
      // is dropped without splitting the surrounding grid or leaving a blank
      // tile (resolveArchiveMedia needs the nested MediaItem, not just MediaFull).
      if (item.media?.media) run.push({ item, index: i });
      return;
    }
    flush();
    blocks.push(
      // Full-width click target carrying the items[] index — mirrors hero, which
      // wraps every block in a data-hero-block-index div. The block renders
      // inside so the parent `space-y` rhythm is preserved; inert on /timeline.
      <div key={`block-${i}`} data-archive-block-index={i}>
        <ArchiveItemBlock
          item={item}
          heading={heading}
          languageId={languageId}
        />
      </div>,
    );
  });
  flush();

  return <div className="space-y-10 lg:space-y-14">{blocks}</div>;
}

export default function PageComponent({
  archive,
}: {
  archive?: common_ArchiveFull;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentYear = new Date().getFullYear();
  const currentTranslation =
    archive?.archiveList?.translations?.find(
      (t) => t.languageId === languageId,
    ) || archive?.archiveList?.translations?.[0];

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full space-y-10 text-textColor lg:min-h-screen lg:space-y-14">
      <div className="flex w-full items-center justify-center">
        <div className="flex w-full max-w-[640px] flex-col items-start justify-center gap-10">
          <div className="w-full space-y-4">
            <Text
              className="w-full break-words text-textInactiveColor"
              variant="uppercase"
            >
              {currentTranslation?.heading || ""}
            </Text>
            <Text variant="uppercase">{`${archive?.archiveList?.tag || ""} / ${currentYear}`}</Text>
          </div>
          {currentTranslation?.description && (
            <Text className="break-words text-justify lg:text-left">
              {currentTranslation?.description}
            </Text>
          )}
        </div>
      </div>

      {archive?.mainMedia?.map((item) => {
        const isVideoItem = isVideo(item.media?.thumbnail?.mediaUrl);
        if (isVideoItem) {
          return (
            <div
              key={item.id}
              className="relative aspect-video h-full w-full overflow-hidden lg:h-[80vh]"
            >
              <video
                src={item.media?.thumbnail?.mediaUrl || ""}
                className="h-full w-full object-cover"
                poster={item.media?.thumbnail?.mediaUrl}
                autoPlay
                playsInline
                controls={false}
                muted
                loop
                preload="metadata"
                ref={videoRef}
              >
                Your browser does not support the video tag.
              </video>
              <Button
                onClick={toggleSound}
                className="absolute bottom-2.5 right-2.5 uppercase text-white mix-blend-difference"
                aria-label={isMuted ? "unmute" : "mute"}
              >
                {isMuted ? "sound on" : "sound off"}
              </Button>
            </div>
          );
        }
        return (
          <div key={item.id} className="relative h-full w-full lg:h-[80vh]">
            <ImageComponent
              src={item.media?.thumbnail?.mediaUrl || ""}
              alt={currentTranslation?.heading || "Featured archive image"}
              aspectRatio={calculateAspectRatio(
                item.media?.thumbnail?.width,
                item.media?.thumbnail?.height,
              )}
              priority={true}
              loading="eager"
            />
          </div>
        );
      })}
      {archive?.items && archive.items.length > 0 && (
        <ArchiveBody
          items={archive.items}
          heading={currentTranslation?.heading || ""}
          languageId={languageId}
        />
      )}
    </div>
  );
}
