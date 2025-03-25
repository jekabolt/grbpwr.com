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

export function DesktopNavigationMenu({ className }: { className?: string }) {
  const { hero } = useDataContext();
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
    <NavigationMenu.Root className={cn("", className)}>
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
            <div className="flex justify-between border border-red-500">
              <LinksGroup
                links={processedCategories.map((item) => ({
                  href: `${item.href}&${men}`,
                  title: item.name,
                  id: item.id.toString(),
                }))}
              />

              <div className="reladive border border-blue-500">
                <div className="w-32 border border-green-500">
                  <Image
                    src={
                      hero?.navFeatured?.men?.media?.media?.thumbnail
                        ?.mediaUrl || ""
                    }
                    alt="hero"
                    aspectRatio="1/1"
                  />
                </div>
              </div>
            </div>
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

      <div className="perspective-[2000px] absolute left-0 top-full flex w-full justify-center">
        <NavigationMenu.Viewport className="h-[var(--radix-navigation-menu-viewport-height)] w-full" />
      </div>
    </NavigationMenu.Root>
  );
}

function LinksGroup({
  className,
  links,
}: {
  className?: string;
  links: {
    title: string;
    href: string;
    id: string;
  }[];
}) {
  const { leftSideCategoryLinks, rightSideCategoryLinks } =
    filterNAvigationLinks(links);

  return (
    <div className={cn("flex gap-24 px-7 pt-10", className)}>
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
        <Text variant="uppercase">new in</Text>
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
  );
}
