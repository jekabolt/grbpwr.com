"use client";

import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { filterNavigationLinks, processCategories } from "@/lib/categories-map";
import { calculateAspectRatio, cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";

import { Button } from "./button";
import Image from "./image";
import { Text } from "./text";

export function DesktopNavigationMenu({
  isNavOpen,
  className,
  isBigMenuEnabled,
  onNavOpenChange,
}: {
  isNavOpen: boolean;
  isBigMenuEnabled?: boolean;
  className?: string;
  onNavOpenChange: (isOpen: boolean) => void;
}) {
  const { dictionary } = useDataContext();
  const men = `/catalog/men`;
  const women = `/catalog/women`;

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
      <NavigationMenu.List className="flex items-center gap-4">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="flex items-center text-textBaseSize data-[state=open]:underline">
            <Link href={men} className="flex items-center">
              men
            </Link>
          </NavigationMenu.Trigger>
          {isBigMenuEnabled && (
            <NavigationMenu.Content className="absolute left-0 top-0 min-h-80 w-full bg-bgColor text-textColor">
              <LinksGroup
                gender="men"
                links={processedCategories.map((item) => ({
                  href: `${item.href}&gender=men`,
                  title: item.name,
                  id: item.id.toString(),
                }))}
              />
            </NavigationMenu.Content>
          )}
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="flex items-center text-textBaseSize data-[state=open]:underline">
            <Link href={women} className="flex items-center">
              women
            </Link>
          </NavigationMenu.Trigger>
          {isBigMenuEnabled && (
            <NavigationMenu.Content className="absolute left-0 top-0 min-h-80 w-full bg-bgColor text-textColor">
              <LinksGroup
                gender="women"
                links={processedCategories.map((item) => ({
                  href: `${item.href}&gender=women`,
                  title: item.name,
                  id: item.id.toString(),
                }))}
              />
            </NavigationMenu.Content>
          )}
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <Button asChild>
            <NavigationMenu.Link
              href={`/catalog?topCategoryIds=${objectsCategoryId}`}
              className="flex items-center text-textBaseSize underline-offset-2 hover:underline"
            >
              objects
            </NavigationMenu.Link>
          </Button>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <Button asChild>
            <NavigationMenu.Link
              href="/archive"
              className="flex items-center text-textBaseSize underline-offset-2 hover:underline"
            >
              archive
            </NavigationMenu.Link>
          </Button>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div
        className={cn("fixed inset-x-2.5 top-12 flex justify-center", {
          "border-x border-b border-textInactiveColor": isNavOpen,
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
  const activeHeroNavLink = isTagLink ? tagLink : archiveLink;

  return (
    <div className="flex w-full justify-between px-7 py-10">
      <div className="flex gap-24">
        <div className="space-y-4">
          <Button className="uppercase hover:underline" asChild>
            <Link href={`/catalog/${gender}`}>all</Link>
          </Button>
          <div className="space-y-4">
            {filteredLeftSideCategoryLinks.map((link) => (
              <div className="w-full" key={link.id}>
                <Button className="hover:underline" asChild>
                  <Link href={`/catalog/${gender}/${link.title.toLowerCase()}`}>
                    {link.title}
                  </Link>
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
              <div className="w-full" key={link.id}>
                <Button className="uppercase hover:underline" asChild>
                  <Link href={`/catalog/${gender}/${link.title.toLowerCase()}`}>
                    {link.title}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-40">
        <Button asChild>
          <Link href={activeHeroNavLink} className="space-y-2">
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
