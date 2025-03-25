"use client";

import Link from "next/link";
import { GENDER_MAP } from "@/constants";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import {
  CATEGORY_TITLE_MAP,
  filterNAvigationLinks,
  processCategories,
} from "@/lib/categories-map";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import Image from "@/components/ui/image";

import { Button } from "./button";
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
          <NavigationMenu.Trigger
            className={cn(
              "flex items-center px-2 text-textBaseSize data-[state=open]:underline",
            )}
          >
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
          <NavigationMenu.Trigger
            className={cn(
              "flex items-center px-2 text-textBaseSize data-[state=open]:underline",
            )}
          >
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
    filterNAvigationLinks(links);

  return (
    <div className="flex w-full justify-between px-7 py-10">
      <div className={cn("flex gap-24", className)}>
        <div className="space-y-4">
          <Button className="uppercase hover:underline" asChild>
            <Link href="/catalog">garments</Link>
          </Button>
          <div className="space-y-4">
            {leftSideCategoryLinks.map((link) => (
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
          <Text variant="uppercase" className="hover:underline">
            new in
          </Text>
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
      <div className="space-y-2 border border-blue-500">
        <div className="w-40 border border-green-500">
          <Image
            src={
              hero?.navFeatured?.[gender]?.media?.media?.thumbnail?.mediaUrl ||
              ""
            }
            alt="hero"
            aspectRatio="1/1"
          />
        </div>
        <Button>{hero?.navFeatured?.[gender]?.exploreText}</Button>
      </div>
    </div>
  );
}
