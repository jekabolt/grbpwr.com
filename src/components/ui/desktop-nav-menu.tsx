import Link from "next/link";
import { GENDER_MAP } from "@/constants";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { groupCategories } from "@/lib/categories-map";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import useFilterQueryParams from "@/app/catalog/_components/useFilterQueryParams";

import { Button } from "./button";
import { Text } from "./text";

export function DesktopNavigationMenu({ className }: { className?: string }) {
  const { dictionary } = useDataContext();
  const men = `gender=${GENDER_MAP["men"]}`;
  const women = `gender=${GENDER_MAP["women"]}`;
  const categoriesGroups = groupCategories(
    dictionary?.categories?.map((v) => v.name as string) || [],
  );

  return (
    <NavigationMenu.Root className={cn("flex-none", className)}>
      <NavigationMenu.List className="flex list-none gap-1">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className={cn(
              "bg-textColor px-2 text-bgColor data-[state=open]:bg-bgColor data-[state=open]:text-textColor",
            )}
          >
            <Link href={`/catalog?${men}`}>men</Link>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="blackTheme absolute left-0 top-0 w-full bg-bgColor p-5 text-textColor">
            <div className="flex gap-x-7">
              {Object.entries(categoriesGroups).map(([key, category], i) => (
                <LinksGroup
                  groupIndex={i}
                  className="w-40"
                  key={key}
                  title={category.title}
                  gender={GENDER_MAP["men"]}
                  links={category.items.map((item) => ({
                    title: item.label.toLowerCase(),
                    href: `${item.href}&${men}`,
                    id: item.id,
                  }))}
                />
              ))}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className={cn(
              "bg-textColor px-2 text-bgColor data-[state=open]:bg-bgColor data-[state=open]:text-textColor",
            )}
          >
            <Link href={`/catalog?${women}`}>women</Link>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="blackTheme absolute left-0 top-0 w-full bg-bgColor p-5 text-textColor">
            <div className="flex gap-x-7">
              {Object.entries(categoriesGroups).map(([key, category], i) => (
                <LinksGroup
                  groupIndex={i}
                  className="w-40"
                  key={key}
                  title={category.title}
                  gender={GENDER_MAP["women"]}
                  links={category.items.map((item) => ({
                    title: item.label.toLowerCase(),
                    href: `${item.href}&${women}`,
                    id: item.id,
                  }))}
                />
              ))}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <Button variant="simple" asChild>
            <NavigationMenu.Link href="/archive" className="px-2">
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
  groupIndex,
  className,
  title,
  links,
  gender,
}: {
  groupIndex: number;
  className?: string;
  title: string;
  gender: string;
  links: {
    title: string;
    href: string;
    id: string;
  }[];
}) {
  const { defaultValue: category } = useFilterQueryParams("category");
  const { defaultValue: currentGender } = useFilterQueryParams("gender");
  const selectedCategories = category?.split(",") || [];
  const genderCategories = currentGender === gender ? selectedCategories : [];
  const isSelectedCategory = (id: string) => genderCategories.includes(id);

  const getViewAllHref = () => {
    const groupCategoryIds = links.map((link) => link.id);
    return `/catalog?category=${encodeURIComponent(groupCategoryIds.join(","))}&gender=${gender}`;
  };

  const getNewHref = (id: string) => {
    const newCategories = isSelectedCategory(id)
      ? genderCategories.filter((v) => v !== id)
      : [...genderCategories, id];

    return `/catalog?category=${encodeURIComponent(newCategories.join(","))}&gender=${gender}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Text variant="uppercase" className="text-xl">
        {title}
      </Text>
      <div className="space-y-2">
        <div className="w-full">
          <Button variant="simpleReverse" asChild>
            <NavigationMenu.Link href={getViewAllHref()}>
              view all
            </NavigationMenu.Link>
          </Button>
        </div>
        {links.map((link) => (
          <div className="w-full" key={link.href}>
            <Button
              variant={isSelectedCategory(link.id) ? "simple" : "simpleReverse"}
              asChild
            >
              <NavigationMenu.Link href={getNewHref(link.id)}>
                {link.title}
              </NavigationMenu.Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
