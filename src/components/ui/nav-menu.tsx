import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { groupCategories } from "@/lib/categories-map";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";

import { Button } from "./button";

export function NavigationMenuComponent() {
  const { dictionary } = useDataContext();

  const categoriesGroups = groupCategories(
    dictionary?.categories?.map((v) => v.name as string) || [],
  );

  return (
    <NavigationMenu.Root className="">
      <NavigationMenu.List className="flex list-none gap-5">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className={cn(
              "bg-textColor text-bgColor data-[state=open]:bg-bgColor data-[state=open]:text-textColor",
            )}
          >
            catalog
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 bg-textColor p-5">
            <div className="flex gap-x-8">
              <div className="mr-16 space-y-4">
                <Button variant={"underlineReverse"}>ALL</Button>
                <Button variant={"underlineReverse"}>MEN</Button>
                <Button variant={"underlineReverse"}>WOMEN</Button>
              </div>

              {Object.entries(categoriesGroups).map(([key, category]) => (
                <LinksGroup
                  className="w-40"
                  key={key}
                  title={category.title}
                  links={category.items.map((item) => ({
                    title: item.label.toLowerCase(),
                    href: item.href,
                  }))}
                />
              ))}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <Button variant="simple" asChild>
            <NavigationMenu.Link href="/catalog">ss{"'"}25</NavigationMenu.Link>
          </Button>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Button variant="simple" asChild>
            <NavigationMenu.Link href="/archive">archive</NavigationMenu.Link>
          </Button>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div className="perspective-[2000px] absolute left-0 top-full flex w-full justify-center">
        <NavigationMenu.Viewport className="h-[var(--radix-navigation-menu-viewport-height)] w-full bg-textColor" />
      </div>
    </NavigationMenu.Root>
  );
}

function LinksGroup({
  className,
  title,
  links,
}: {
  className?: string;
  title: string;
  links: {
    title: string;
    href: string;
  }[];
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <p className="uppercase text-bgColor">{title}</p>
      <div className="space-y-2">
        <div className="w-full">
          <Button variant="simple" asChild>
            <NavigationMenu.Link href="/catalog">view all</NavigationMenu.Link>
          </Button>
        </div>
        {links.map((link, i) => (
          <div className="w-full" key={link.href}>
            <Button variant="simple" asChild>
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
