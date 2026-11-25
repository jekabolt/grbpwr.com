"use client";

import { Fragment } from "react";
import type { common_HeroEntityWithTranslations } from "@/api/proto-http/frontend";

import { sendHeroEvent } from "@/lib/analitycs/hero";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { FeaturedItems } from "./featured-items";
import { HeroArchive } from "./hero-archive";
import { HeroAudienceGate } from "./hero-audience-gate";
import { HeroDrop } from "./hero-drop";
import { HeroEmbed } from "./hero-embed";
import { HeroLookbook } from "./hero-lookbook";
import { HeroMarquee } from "./hero-marquee";
import { HeroMosaic } from "./hero-mosaic";
import { HeroNewsletter } from "./hero-newsletter";
import { HeroProductSpotlight } from "./hero-product-spotlight";
import { HeroSingle } from "./hero-single";
import { HeroSlideshow } from "./hero-slideshow";
import { HeroSplit } from "./hero-split";
import { HeroStatement } from "./hero-statement";
import { HeroVideo } from "./hero-video";
import { MainAds } from "./main-ads";

export function Ads({
  entities,
  preview = false,
}: {
  entities: common_HeroEntityWithTranslations[];
  // The /preview editor renders every block regardless of audience so the editor
  // can see and select all of them; the homepage applies the targeting gate.
  preview?: boolean;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  return (
    <div>
      {entities?.map((e, i) => {
        // Prioritize first ad for better LCP
        const isPriorityAd = i === 0;
        const block = (() => {
          switch (e.type) {
            case "HERO_TYPE_MAIN":
              // MAIN renders inline like every other block, so any number of
              // them can appear at any position (not just entities[0]).
              return (
                <div data-hero-block-index={i}>
                  <MainAds main={e.main} priority={isPriorityAd} />
                </div>
              );
            case "HERO_TYPE_SINGLE":
              return (
                <div data-hero-block-index={i}>
                  <HeroSingle
                    single={e.single}
                    priority={isPriorityAd}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_SINGLE" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_DOUBLE":
              return (
                <div
                  data-hero-block-index={i}
                  className="relative flex h-full w-full flex-col lg:flex-row"
                >
                  <HeroSingle
                    single={e.double?.left}
                    priority={isPriorityAd}
                    fit="contain"
                    responsive={false}
                    className="relative h-full w-full"
                    copyClassName="gap-6"
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_DOUBLE_LEFT" })
                    }
                  />
                  <HeroSingle
                    single={e.double?.right}
                    priority={isPriorityAd}
                    fit="contain"
                    responsive={false}
                    className="relative h-full w-full"
                    copyClassName="gap-6"
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_DOUBLE_RIGHT" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_FEATURED_PRODUCTS": {
              const itemsQuantity = e.featuredProducts?.products?.length || 0;
              const productsTranslation =
                e.featuredProducts?.translations?.find(
                  (t) => t.languageId === languageId,
                );
              return (
                <div style={{ display: "contents" }} data-hero-block-index={i}>
                  <FeaturedItems
                    products={e.featuredProducts?.products}
                    headline={productsTranslation?.headline}
                    exploreText={productsTranslation?.exploreText}
                    exploreLink={e.featuredProducts?.exploreLink}
                    itemsQuantity={itemsQuantity}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_FEATURED_PRODUCTS" })
                    }
                  />
                </div>
              );
            }
            case "HERO_TYPE_FEATURED_PRODUCTS_TAG": {
              const productsTagCount =
                e.featuredProductsTag?.products?.products?.length || 0;
              const productsTagTranslation =
                e.featuredProductsTag?.translations?.find(
                  (t) => t.languageId === languageId,
                );
              return (
                <div style={{ display: "contents" }} data-hero-block-index={i}>
                  <FeaturedItems
                    products={e.featuredProductsTag?.products?.products}
                    headline={productsTagTranslation?.headline}
                    exploreText={productsTagTranslation?.exploreText}
                    exploreLink={e.featuredProductsTag?.products?.exploreLink}
                    itemsQuantity={productsTagCount}
                    onHeroClick={() =>
                      sendHeroEvent({
                        heroType: "HERO_TYPE_FEATURED_PRODUCTS_TAG",
                      })
                    }
                  />
                </div>
              );
            }
            case "HERO_TYPE_FEATURED_ARCHIVE":
              return (
                <div style={{ display: "contents" }} data-hero-block-index={i}>
                  <HeroArchive
                    entity={e}
                    className="space-y-12 pt-16 lg:py-32"
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_FEATURED_ARCHIVE" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_NEW_ARRIVALS": {
              const newArrivalsCount = e.newArrivals?.products?.length || 0;
              const newArrivalsTranslation = e.newArrivals?.translations?.find(
                (t) => t.languageId === languageId,
              );
              return (
                <div style={{ display: "contents" }} data-hero-block-index={i}>
                  <FeaturedItems
                    products={e.newArrivals?.products}
                    headline={newArrivalsTranslation?.headline}
                    exploreText={newArrivalsTranslation?.exploreText}
                    exploreLink={e.newArrivals?.exploreLink}
                    itemsQuantity={newArrivalsCount}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_NEW_ARRIVALS" })
                    }
                  />
                </div>
              );
            }
            case "HERO_TYPE_LAST_CHANCE": {
              const lastChanceCount = e.lastChance?.products?.length || 0;
              const lastChanceTranslation = e.lastChance?.translations?.find(
                (t) => t.languageId === languageId,
              );
              return (
                <div style={{ display: "contents" }} data-hero-block-index={i}>
                  <FeaturedItems
                    products={e.lastChance?.products}
                    headline={lastChanceTranslation?.headline}
                    exploreText={lastChanceTranslation?.exploreText}
                    exploreLink={e.lastChance?.exploreLink}
                    itemsQuantity={lastChanceCount}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_LAST_CHANCE" })
                    }
                  />
                </div>
              );
            }
            case "HERO_TYPE_MARQUEE":
              return (
                <div data-hero-block-index={i}>
                  <HeroMarquee
                    marquee={e.marquee}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_MARQUEE" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_VIDEO":
              return (
                <div data-hero-block-index={i}>
                  <HeroVideo
                    video={e.video}
                    priority={isPriorityAd}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_VIDEO" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_EMBED":
              return (
                <div data-hero-block-index={i}>
                  <HeroEmbed
                    embed={e.embed}
                    priority={isPriorityAd}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_EMBED" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_DROP":
              return (
                <div data-hero-block-index={i}>
                  <HeroDrop
                    drop={e.drop}
                    priority={isPriorityAd}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_DROP" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_SPLIT":
              return (
                <div data-hero-block-index={i}>
                  <HeroSplit
                    split={e.split}
                    priority={isPriorityAd}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_SPLIT" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_MOSAIC":
              return (
                <div data-hero-block-index={i}>
                  <HeroMosaic
                    mosaic={e.mosaic}
                    priority={isPriorityAd}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_MOSAIC" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_SLIDESHOW":
              return (
                <div data-hero-block-index={i}>
                  <HeroSlideshow
                    slideshow={e.slideshow}
                    priority={isPriorityAd}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_SLIDESHOW" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_STATEMENT":
              return (
                <div data-hero-block-index={i}>
                  <HeroStatement
                    statement={e.statement}
                    priority={isPriorityAd}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_STATEMENT" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_NEWSLETTER":
              return (
                <div data-hero-block-index={i}>
                  <HeroNewsletter
                    newsletter={e.newsletter}
                    priority={isPriorityAd}
                  />
                </div>
              );
            case "HERO_TYPE_PRODUCT_SPOTLIGHT":
              return (
                <div data-hero-block-index={i}>
                  <HeroProductSpotlight
                    spotlight={e.productSpotlight}
                    priority={isPriorityAd}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_PRODUCT_SPOTLIGHT" })
                    }
                  />
                </div>
              );
            case "HERO_TYPE_LOOKBOOK":
              return (
                <div data-hero-block-index={i}>
                  <HeroLookbook
                    lookbook={e.lookbook}
                    priority={isPriorityAd}
                    onHeroClick={() =>
                      sendHeroEvent({ heroType: "HERO_TYPE_LOOKBOOK" })
                    }
                  />
                </div>
              );
            default:
              return null;
          }
        })();

        if (!block) return null;
        if (preview) return <Fragment key={i}>{block}</Fragment>;
        return (
          <HeroAudienceGate
            key={i}
            audience={e.audience}
            minTierId={e.minTierId}
          >
            {block}
          </HeroAudienceGate>
        );
      })}
    </div>
  );
}
