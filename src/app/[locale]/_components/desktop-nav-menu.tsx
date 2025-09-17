"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useTranslations } from "next-intl";

import {
  filterNavigationLinks,
  getTopCategoryName,
  processCategories,
} from "@/lib/categories-map";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { useAnnounce } from "@/app/[locale]/_components/useAnnounce";

import { AnimatedButton } from "../../../components/ui/animated-button";
import { Button } from "../../../components/ui/button";
import Image from "../../../components/ui/image";
import { Text } from "../../../components/ui/text";

export function DesktopNavigationMenu({
  isCatalog,
  className,
  isBigMenuEnabled,
  onNavOpenChange,
}: {
  isCatalog?: boolean;
  isBigMenuEnabled?: boolean;
  className?: string;
  onNavOpenChange: (isOpen: boolean) => void;
}) {
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);

  const pathname = usePathname();
  const { open } = useAnnounce(dictionary?.announce || "");

  const t = useTranslations("navigation");

  const processedCategories = dictionary?.categories
    ? processCategories(dictionary.categories, languageId).filter(
        (category) => category.name.toLowerCase() !== "objects",
      )
    : [];

  const genderNavItems = [
    {
      gender: "men" as const,
      href: "/catalog/men",
      isActive: pathname.startsWith("/catalog/men"),
    },
    {
      gender: "women" as const,
      href: "/catalog/women",
      isActive: pathname.startsWith("/catalog/women"),
    },
  ];

  const isOnObjectsPage = pathname.startsWith("/catalog/objects");

  return (
    <NavigationMenu.Root
      className={cn("w-full", className)}
      onValueChange={(value) => {
        onNavOpenChange(!!value);
      }}
    >
      <NavigationMenu.List className="flex items-center gap-4">
        {genderNavItems.map(({ gender, href, isActive }) => (
          <NavigationMenu.Item key={gender}>
            <NavigationMenu.Trigger
              className={cn(
                "flex items-center text-textBaseSize data-[state=open]:underline",
                { underline: isActive },
              )}
            >
              <Link href={href} className="flex items-center">
                {t(gender)}
              </Link>
            </NavigationMenu.Trigger>
            {isBigMenuEnabled && (
              <NavigationMenu.Content className="blackTheme absolute left-0 top-0 min-h-56 w-full bg-bgColor text-textColor">
                <LinksGroup
                  gender={gender}
                  links={processedCategories.map((item) => ({
                    href: `/catalog/${gender}/${item.name.toLowerCase()}`,
                    title: item.name,
                    id: item.id.toString(),
                  }))}
                />
              </NavigationMenu.Content>
            )}
          </NavigationMenu.Item>
        ))}

        <NavigationMenu.Item>
          <Button asChild>
            <Link
              href={`/catalog/objects`}
              className={cn(
                "flex items-center text-textBaseSize underline-offset-2 hover:underline",
                { underline: isOnObjectsPage },
              )}
            >
              {t("objects")}
            </Link>
          </Button>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <Button asChild>
            <Link
              href="/timeline"
              className="flex items-center text-textBaseSize underline-offset-2 hover:underline"
            >
              {t("timeline")}
            </Link>
          </Button>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div
        className={cn("fixed inset-x-2.5 top-12 flex justify-center", {
          "top-16": open && !isCatalog,
          "border-none": !isBigMenuEnabled,
        })}
      >
        <NavigationMenu.Viewport className="h-[var(--radix-navigation-menu-viewport-height)] w-full" />
      </div>
    </NavigationMenu.Root>
  );
}

function LinksGroup({
  links,
  gender,
}: {
  gender: "men" | "women";
  links: {
    title: string;
    href: string;
    id: string;
  }[];
}) {
  const { hero, dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);
  const t = useTranslations("navigation");

  // Get English categories for URL generation
  const englishCategories = dictionary?.categories
    ? processCategories(dictionary.categories, 1).filter(
        (category) => category.name.toLowerCase() !== "objects",
      )
    : [];

  const englishLinks = englishCategories.map((item) => ({
    href: `/catalog/${gender}/${item.name.toLowerCase()}`,
    title: item.name,
    id: item.id.toString(),
  }));

  const { leftSideCategoryLinks, rightSideCategoryLinks } =
    filterNavigationLinks(englishLinks);
  const heroNav = hero?.navFeatured?.[gender];
  const isTagLink = heroNav?.featuredTag;
  const newIn = `/catalog?order=ORDER_FACTOR_DESC&sort=SORT_FACTOR_CREATED_AT`;
  const tagLink = `/catalog?tag=${heroNav?.featuredTag}`;
  const archiveLink = `/timeline?id=${heroNav?.featuredArchiveId}`;
  const activeHeroNavLink = isTagLink ? tagLink : archiveLink;
  const filteredLeftSideCategoryLinks =
    gender === "men"
      ? leftSideCategoryLinks.filter((c) => c.title.toLowerCase() !== "dresses")
      : leftSideCategoryLinks;

  return (
    <div className="flex w-full justify-between px-7 py-10">
      <div className="flex gap-24">
        <div className="space-y-4">
          <Button className="uppercase hover:underline" asChild>
            <Link href={`/catalog/${gender}`}>{t("all")}</Link>
          </Button>
          <div className="space-y-4">
            {filteredLeftSideCategoryLinks.map((link) => {
              const translatedName = getTopCategoryName(
                dictionary?.categories || [],
                parseInt(link.id),
                languageId,
              );
              return (
                <div className="w-full" key={link.href}>
                  <Button className="uppercase hover:underline" asChild>
                    <Link href={link.href}>{translatedName || link.title}</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <Button className="uppercase hover:underline" asChild>
            <NavigationMenu.Link href={newIn}>
              {t("new in")}
            </NavigationMenu.Link>
          </Button>
          <div className="space-y-4">
            {rightSideCategoryLinks.map((link) => {
              const translatedName = getTopCategoryName(
                dictionary?.categories || [],
                parseInt(link.id),
                languageId,
              );
              return (
                <div className="w-full" key={link.id}>
                  <Button className="uppercase hover:underline" asChild>
                    <NavigationMenu.Link
                      href={`/catalog/${gender}/${link.title.toLowerCase()}`}
                    >
                      {translatedName || link.title}
                    </NavigationMenu.Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {heroNav?.media?.media?.thumbnail?.mediaUrl && (
        <div className="w-40">
          <AnimatedButton href={activeHeroNavLink} className="space-y-2">
            <div className="w-full">
              <Image
                src={heroNav?.media?.media?.thumbnail?.mediaUrl || ""}
                alt="hero"
                aspectRatio={calculateAspectRatio(
                  heroNav?.media?.media?.thumbnail?.width,
                  heroNav?.media?.media?.thumbnail?.height,
                )}
              />
            </div>
            <Text>
              {heroNav?.translations?.find((t) => t.languageId === languageId)
                ?.exploreText || heroNav?.translations?.[0]?.exploreText}
            </Text>
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}
