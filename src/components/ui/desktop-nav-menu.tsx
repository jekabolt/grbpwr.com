import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GENDER_MAP } from "@/constants";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { groupCategories } from "@/lib/categories-map";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";

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
            className={cn("px-2 data-[state=open]:underline")}
          >
            <Link href={`/catalog?${men}`}>men</Link>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 w-full bg-bgColor p-5 text-textColor">
            <div className="flex gap-x-7">
              {Object.entries(categoriesGroups).map(([key, category], i) => (
                <LinksGroup
                  groupIndex={i}
                  className="w-40"
                  key={key}
                  title={category.title}
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
            className={cn("px-2 data-[state=open]:underline")}
          >
            <Link href={`/catalog?${women}`}>women</Link>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 w-full bg-bgColor p-5 text-textColor">
            <div className="flex gap-x-7">
              {Object.entries(categoriesGroups).map(([key, category], i) => (
                <LinksGroup
                  groupIndex={i}
                  className="w-40"
                  key={key}
                  title={category.title}
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
          <Button variant="simpleReverse" asChild>
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
}: {
  groupIndex: number;
  className?: string;
  title: string;
  links: {
    title: string;
    href: string;
    id: string;
  }[];
}) {
  const category = useSearchParams().get("category");

  return (
    <div className={cn("space-y-4", className)}>
      <Text variant="uppercase" className="text-xl">
        {title}
      </Text>
      <div className="space-y-2">
        <div className="w-full">
          <Button variant="simpleReverse" asChild>
            <NavigationMenu.Link href="/catalog">view all</NavigationMenu.Link>
          </Button>
        </div>
        {links.map((link) => (
          <div className="w-full" key={link.href}>
            <Button
              variant={category === link.id ? "simple" : "simpleReverse"}
              asChild
            >
              <NavigationMenu.Link href={link.href}>
                {link.title}
              </NavigationMenu.Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
