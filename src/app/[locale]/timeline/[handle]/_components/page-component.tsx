"use client";

import { Children, useRef, useState, type ReactNode } from "react";
import {
  common_ArchiveItemTranslation,
  common_ArchiveMediaAspectRatio,
  common_MediaFull,
  StorefrontArchiveFull,
  StorefrontArchiveItemFull,
  StorefrontColorway,
} from "@/api/proto-http/frontend";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, cn, resolveArchiveMedia } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { ArchiveMediaThumbnail } from "../../_components/archive-media-thumbnail";
import { ProductItem } from "../../../_components/product-item";

// Maps the proto aspect-ratio enum to a CSS `aspect-ratio`. UNKNOWN (e.g. a
// video that carries its own dimensions) returns undefined so callers fall back
// to the media's natural ratio.
function aspectRatioValue(
  ratio: common_ArchiveMediaAspectRatio | undefined,
): string | undefined {
  switch (ratio) {
    case "ARCHIVE_MEDIA_ASPECT_RATIO_16X9":
      return "16/9";
    case "ARCHIVE_MEDIA_ASPECT_RATIO_2X1":
      return "2/1";
    case "ARCHIVE_MEDIA_ASPECT_RATIO_1X1":
      return "1/1";
    case "ARCHIVE_MEDIA_ASPECT_RATIO_3X4":
      return "3/4";
    default:
      return undefined;
  }
}

// Per-block translation for the active language, falling back to the first.
function pickTranslation(
  translations: common_ArchiveItemTranslation[] | undefined,
  languageId: number,
) {
  return (
    translations?.find((t) => t.languageId === languageId) || translations?.[0]
  );
}

// Small uppercase label above a block (product/products/embed/media caption).
function ArchiveCaption({ children }: { children: string }) {
  return (
    <Text variant="uppercase" className="text-textInactiveColor">
      {children}
    </Text>
  );
}

// Products layout (also the single-product card): one item is a centred card;
// two or more form a CENTRED, wrapping row of equal card-size tiles — 2-up on
// mobile, 4-up (small) on desktop. `justify-center` centres partial rows so 2-3
// products sit in the middle on desktop, not flush left. No container gap — that
// overflows flex-basis and wraps a full row early — so gutters are per-item
// padding. Equal heights come from ProductItem's fixed 3/4 cover box.
function ArchiveTileRow({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  if (items.length === 0) return null;

  if (items.length === 1) {
    return <div className="mx-auto w-1/2 lg:w-1/4">{items[0]}</div>;
  }

  return (
    <div className="flex flex-wrap justify-center">
      {items.map((item, i) => (
        <div key={i} className="min-w-0 basis-1/2 p-1 lg:basis-1/4 lg:p-2">
          {item}
        </div>
      ))}
    </div>
  );
}

// MAIN_MEDIA: a single hero-scale media. Video autoplays muted & looping with a
// sound toggle; images honour the block aspect ratio (16:9 / 2:1 / 1:1), or the
// media's natural ratio when UNKNOWN.
function MainMediaBlock({
  mediaFull,
  aspectRatio,
  heading,
  priority,
}: {
  mediaFull: common_MediaFull | undefined;
  aspectRatio: common_ArchiveMediaAspectRatio | undefined;
  heading: string;
  priority: boolean;
}) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const media = resolveArchiveMedia(mediaFull?.media);
  if (!media.src) return null;

  const naturalRatio = calculateAspectRatio(
    mediaFull?.media?.fullSize?.width,
    mediaFull?.media?.fullSize?.height,
  );
  const ratio = aspectRatioValue(aspectRatio) ?? naturalRatio;

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (media.type === "video") {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: ratio }}
      >
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          playsInline
          controls={false}
          muted
          loop
          preload="metadata"
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

  // Box holds the chosen aspect; `fit="cover"` makes the image crop to fill it
  // rather than squishing when the media's natural ratio differs from the box.
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: ratio }}
    >
      <ImageComponent
        src={media.src}
        alt={heading || "archive"}
        aspectRatio={ratio}
        fit="cover"
        blurhash={mediaFull?.media?.blurhash}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
}

// One tile within a MEDIA_LINE. Hover-plays video on desktop, autoplays on
// mobile — same behaviour the media grid always had.
function MediaLineTile({
  mediaFull,
  aspectRatio,
  alt,
  priority,
}: {
  mediaFull: common_MediaFull | undefined;
  aspectRatio: string;
  alt: string;
  priority: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const media = resolveArchiveMedia(mediaFull?.media);
  const isVideoItem = media.type === "video";

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ArchiveMediaThumbnail
        media={media}
        alt={alt}
        aspectRatio={aspectRatio}
        blurhash={mediaFull?.media?.blurhash}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        playOnHover={!isMobile && isVideoItem && isHovered}
        autoPlay={isMobile && isVideoItem}
      />
    </div>
  );
}

// MEDIA_LINE: 1..4 media sharing one aspect ratio (3:4 or 1:1). Empty/partial
// media are dropped. Unlike the products block (a left-aligned catalog grid),
// a media line is always CENTRED: one tile centres, 2-4 sit in a centred row.
// 3-4 overflow a mobile row, so there they become an infinite looping carousel.
function MediaLineBlock({
  media,
  aspectRatio,
  heading,
  priority,
}: {
  media: common_MediaFull[];
  aspectRatio: common_ArchiveMediaAspectRatio | undefined;
  heading: string;
  priority: boolean;
}) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const cells = media.filter((m) => m.media);
  if (cells.length === 0) return null;
  const ratio = aspectRatioValue(aspectRatio) ?? "3/4";

  const tiles = cells.map((m, i) => (
    <MediaLineTile
      key={m.id ?? i}
      mediaFull={m}
      aspectRatio={ratio}
      alt={`${heading} image ${i + 1}`}
      priority={priority && i < 4}
    />
  ));

  if (cells.length > 2 && isMobile) {
    return (
      <Carousel loop className="flex w-full">
        {tiles.map((tile, i) => (
          <div key={i} className="flex-[0_0_50%] px-1">
            {tile}
          </div>
        ))}
      </Carousel>
    );
  }

  // Centred row of card-size tiles: half-width on mobile, quarter on desktop.
  // `basis` fractions are standard Tailwind (always emitted) and `justify-center`
  // keeps 1-3 tiles centred; each tile carries its own aspect box, so equal
  // widths give equal heights.
  return (
    <div className="flex justify-center gap-2 lg:gap-4">
      {tiles.map((tile, i) => (
        <div key={i} className="min-w-0 basis-1/2 lg:basis-1/4">
          {tile}
        </div>
      ))}
    </div>
  );
}

// MEDIA_WITH_CAPTION: one media (3:4 or 1:1) with a caption and an outbound
// link. The tile is the link target; the caption sits beneath. Centred at the
// editorial column width so it reads as a figure, not a full-bleed hero.
function MediaWithCaptionBlock({
  mediaFull,
  aspectRatio,
  link,
  caption,
  heading,
}: {
  mediaFull: common_MediaFull | undefined;
  aspectRatio: common_ArchiveMediaAspectRatio | undefined;
  link: string | undefined;
  caption: string | undefined;
  heading: string;
}) {
  const media = resolveArchiveMedia(mediaFull?.media);
  if (!media.src) return null;
  const ratio = aspectRatioValue(aspectRatio) ?? "3/4";

  const tile = (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: ratio }}
    >
      <ArchiveMediaThumbnail
        media={media}
        alt={caption || heading || "archive"}
        aspectRatio={ratio}
        blurhash={mediaFull?.media?.blurhash}
        autoPlay={media.type === "video"}
      />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[640px] space-y-2">
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {tile}
        </a>
      ) : (
        tile
      )}
      {caption && <ArchiveCaption>{caption}</ArchiveCaption>}
    </div>
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

// PRODUCT / PRODUCTS_TAG / PRODUCTS_MANUAL. Every card is strictly identical:
// `imageFit="cover"` crop-fills a fixed 3/4 thumbnail box (equal heights, no
// letterboxing), the catalog grid keeps equal widths, and clamping the name to a
// single line (`[&>span]` targets the caption span, not the price row) keeps the
// info block a constant height. >2 products scroll as a carousel on mobile
// (matching the media line); desktop is the small catalog grid.
const PRODUCT_INFO_CLAMP = "[&>span]:block [&>span]:truncate";

function ProductsBlock({
  products,
  caption,
}: {
  products: StorefrontColorway[];
  caption: string | undefined;
}) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  if (products.length === 0) return null;

  const cards = products.map((p, i) => (
    <ProductItem
      key={p.baseSku}
      product={p}
      className="mx-auto"
      imageFit="cover"
      imagePriority={i < 4}
      infoClassName={PRODUCT_INFO_CLAMP}
    />
  ));

  return (
    <div className="space-y-2">
      {caption && <ArchiveCaption>{caption}</ArchiveCaption>}
      {products.length > 2 && isMobile ? (
        <Carousel loop className="flex w-full">
          {cards.map((card, i) => (
            <div key={i} className="flex-[0_0_50%] px-1">
              {card}
            </div>
          ))}
        </Carousel>
      ) : (
        <ArchiveTileRow>{cards}</ArchiveTileRow>
      )}
    </div>
  );
}

// Renders one timeline block by its discriminant. Exactly one payload field on
// the item is populated (selected by `type`); returns null when the block has
// no renderable content.
function renderArchiveBlock({
  item,
  heading,
  languageId,
  priority,
}: {
  item: StorefrontArchiveItemFull;
  heading: string;
  languageId: number;
  priority: boolean;
}): ReactNode {
  switch (item.type) {
    case "ARCHIVE_ITEM_TYPE_MAIN_MEDIA":
      return (
        <MainMediaBlock
          mediaFull={item.mainMedia?.media}
          aspectRatio={item.mainMedia?.aspectRatio}
          heading={heading}
          priority={priority}
        />
      );
    case "ARCHIVE_ITEM_TYPE_MEDIA_LINE":
      return (
        <MediaLineBlock
          media={item.mediaLine?.media ?? []}
          aspectRatio={item.mediaLine?.aspectRatio}
          heading={heading}
          priority={priority}
        />
      );
    case "ARCHIVE_ITEM_TYPE_TEXT": {
      const text = pickTranslation(item.text?.translations, languageId)?.text;
      return text ? (
        <div className="flex w-full items-center justify-center">
          <div className="w-full max-w-[640px]">
            <Text className="break-words text-justify lg:text-left">
              {text}
            </Text>
          </div>
        </div>
      ) : null;
    }
    case "ARCHIVE_ITEM_TYPE_EMBED": {
      const caption = pickTranslation(
        item.embed?.translations,
        languageId,
      )?.caption;
      return item.embed?.embedUrl ? (
        <div className="space-y-2">
          <ArchiveEmbed url={item.embed.embedUrl} title={caption || heading} />
          {caption && <ArchiveCaption>{caption}</ArchiveCaption>}
        </div>
      ) : null;
    }
    case "ARCHIVE_ITEM_TYPE_MEDIA_WITH_CAPTION": {
      const caption = pickTranslation(
        item.mediaWithCaption?.translations,
        languageId,
      )?.caption;
      return (
        <MediaWithCaptionBlock
          mediaFull={item.mediaWithCaption?.media}
          aspectRatio={item.mediaWithCaption?.aspectRatio}
          link={item.mediaWithCaption?.link}
          caption={caption}
          heading={heading}
        />
      );
    }
    case "ARCHIVE_ITEM_TYPE_PRODUCT": {
      const caption = pickTranslation(
        item.product?.translations,
        languageId,
      )?.caption;
      const product = item.product?.colorway;
      return product ? (
        <ProductsBlock products={[product]} caption={caption} />
      ) : null;
    }
    case "ARCHIVE_ITEM_TYPE_PRODUCTS_TAG": {
      const caption = pickTranslation(
        item.productsTag?.translations,
        languageId,
      )?.caption;
      return (
        <ProductsBlock
          products={item.productsTag?.colorways ?? []}
          caption={caption}
        />
      );
    }
    case "ARCHIVE_ITEM_TYPE_PRODUCTS_MANUAL": {
      const caption = pickTranslation(
        item.productsManual?.translations,
        languageId,
      )?.caption;
      return (
        <ProductsBlock
          products={item.productsManual?.colorways ?? []}
          caption={caption}
        />
      );
    }
    default:
      return null;
  }
}

// Renders the ordered, heterogeneous timeline body. Each block renders in
// document order, mirroring the hero's block list; every block is wrapped in a
// `data-archive-block-index` div so the /preview editor can select it on click
// (inert on the live /timeline page).
function ArchiveBody({
  items,
  heading,
  languageId,
}: {
  items: StorefrontArchiveItemFull[];
  heading: string;
  languageId: number;
}) {
  return (
    <div className="space-y-10 lg:space-y-14">
      {items.map((item, i) => (
        <div key={i} data-archive-block-index={i}>
          {renderArchiveBlock({
            item,
            heading,
            languageId,
            // Only the first block eagerly loads its media (LCP); the rest lazy-load.
            priority: i === 0,
          })}
        </div>
      ))}
    </div>
  );
}

export default function PageComponent({
  archive,
}: {
  archive?: StorefrontArchiveFull;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const currentYear = new Date().getFullYear();
  const currentTranslation =
    archive?.archiveList?.translations?.find(
      (t) => t.languageId === languageId,
    ) || archive?.archiveList?.translations?.[0];

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
        </div>
      </div>

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
