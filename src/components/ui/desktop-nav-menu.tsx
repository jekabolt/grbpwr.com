"use client";

import Link from "next/link";
import { GENDER_MAP } from "@/constants";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import {
  CATEGORY_TITLE_MAP,
  filterNavigationLinks,
  processCategories,
} from "@/lib/categories-map";
import { calculateAspectRatio, cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";

import { Button } from "./button";
import Image from "./image";
import { Text } from "./text";

export function DesktopNavigationMenu({
  isNavOpen,
  className,
  onNavOpenChange,
}: {
  isNavOpen: boolean;
  className?: string;
  onNavOpenChange: (isOpen: boolean) => void;
}) {
  const { dictionary } = useDataContext();
  const men = `gender=${GENDER_MAP["men"]}`;
  const women = `gender=${GENDER_MAP["women"]}`;

  const processedCategories = dictionary?.categories
    ? processCategories(dictionary.categories).filter(
        (category) => category.name.toLowerCase() !== "objects",
      )
    : [];

  const objectsCategoryId =
    dictionary?.categories?.find((cat) => cat.name?.toLowerCase() === "objects")
      ?.id || "";

  return (
    <NavigationMenu.Root
      className={cn("w-full", className)}
      onValueChange={(value) => {
        onNavOpenChange(!!value);
      }}
    >
      <NavigationMenu.List className="flex items-center gap-1">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="flex items-center px-2 text-textBaseSize data-[state=open]:underline">
            <Link href={`/catalog?${men}`} className="flex items-center">
              men
            </Link>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 w-full bg-bgColor text-textColor">
            <LinksGroup
              gender="men"
              links={processedCategories.map((item) => ({
                href: `${item.href}&${men}`,
                title: item.name,
                id: item.id.toString(),
              }))}
            />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="flex items-center px-2 text-textBaseSize data-[state=open]:underline">
            <Link href={`/catalog?${women}`} className="flex items-center">
              women
            </Link>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 w-full bg-bgColor text-textColor">
            <LinksGroup
              gender="women"
              links={processedCategories.map((item) => ({
                href: `${item.href}&${women}`,
                title: item.name,
                id: item.id.toString(),
              }))}
            />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <Button asChild>
            <NavigationMenu.Link
              href={`/catalog?topCategoryIds=${objectsCategoryId}`}
              className="flex items-center px-2 text-textBaseSize underline-offset-2 hover:underline"
            >
              objects
            </NavigationMenu.Link>
          </Button>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <Button asChild>
            <NavigationMenu.Link
              href="/archive"
              className="flex items-center px-2 text-textBaseSize underline-offset-2 hover:underline"
            >
              archive
            </NavigationMenu.Link>
          </Button>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div
        className={cn("fixed inset-x-2 top-14 flex justify-center", {
          "border-x border-b border-textInactiveColor": isNavOpen,
        })}
      >
        <NavigationMenu.Viewport className="h-[var(--radix-navigation-menu-viewport-height)] w-full" />
      </div>
    </NavigationMenu.Root>
  );
}

function LinksGroup({
  className,
  links,
  gender,
}: {
  gender: "men" | "women";
  className?: string;
  links: {
    title: string;
    href: string;
    id: string;
  }[];
}) {
  const { hero } = useDataContext();
  const { leftSideCategoryLinks, rightSideCategoryLinks } =
    filterNavigationLinks(links);
  const filteredLeftSideCategoryLinks =
    gender === "men"
      ? leftSideCategoryLinks.filter((c) => c.title.toLowerCase() !== "dresses")
      : leftSideCategoryLinks;

  const heroNav = hero?.navFeatured?.[gender];
  const isTagLink = heroNav?.featuredTag;
  const newIn = `/catalog?order=ORDER_FACTOR_DESC&sort=SORT_FACTOR_CREATED_AT`;
  const tagLink = `/catalog?tag=${heroNav?.featuredTag}`;
  const archiveLink = `/archive?id=${heroNav?.featuredArchiveId}`;

  return (
    <div className="flex w-full justify-between px-7 py-10">
      <div className={cn("flex gap-24", className)}>
        <div className="space-y-4">
          <Button className="uppercase hover:underline" asChild>
            <Link href="/catalog">garments</Link>
          </Button>
          <div className="space-y-4">
            {filteredLeftSideCategoryLinks.map((link) => (
              <div className="w-full" key={link.href}>
                <Button className="hover:underline" asChild>
                  <NavigationMenu.Link href={link.href}>
                    {CATEGORY_TITLE_MAP[link.title] || link.title}
                  </NavigationMenu.Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Button className="uppercase hover:underline" asChild>
            <NavigationMenu.Link href={newIn}>new in</NavigationMenu.Link>
          </Button>
          <div className="space-y-4">
            {rightSideCategoryLinks.map((link) => (
              <div className="w-full" key={link.href}>
                <Button className="uppercase hover:underline" asChild>
                  <NavigationMenu.Link href={link.href}>
                    {link.title}
                  </NavigationMenu.Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-40">
        <Button asChild>
          <Link href={isTagLink ? tagLink : archiveLink} className="space-y-2">
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
            <Text>{heroNav?.exploreText}</Text>
          </Link>
        </Button>
      </div>
    </div>
  );
}
