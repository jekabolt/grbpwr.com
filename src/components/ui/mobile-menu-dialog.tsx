import Link from "next/link";
import { GENDER_MAP } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { groupCategories } from "@/lib/categories-map";
import CurrencyPopover from "@/app/_components/currency-popover";
import NewslatterForm from "@/app/_components/newslatter-form";
import useFilterQueryParams from "@/app/catalog/_components/useFilterQueryParams";

import { useDataContext } from "../DataContext";
import { Button } from "./button";
import { Logo } from "./icons/logo";
import { Text } from "./text";

export function MobileMenuDialog({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: "men" | "women" | undefined;
  setActiveCategory: (category: "men" | "women" | undefined) => void;
}) {
  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <Button variant={"simple"}>menu</Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-30 bg-textColor" />
        <DialogPrimitives.Content className="blackTheme fixed left-0 top-0 z-30 flex h-screen w-screen flex-col bg-bgColor px-2 pb-10 pt-5 text-textColor">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="relative mb-16 flex items-start justify-between gap-2 text-textColor">
            {activeCategory ? (
              <>
                <Button onClick={() => setActiveCategory(undefined)}>
                  <Text>{"<"}</Text>
                </Button>
                <Text variant="uppercase" className="basis-0">
                  {activeCategory}
                </Text>
              </>
            ) : (
              <div className="inline-block aspect-square size-8">
                <Logo />
              </div>
            )}
            <DialogPrimitives.Close asChild>
              <Button className="leading-none">[X]</Button>
            </DialogPrimitives.Close>
          </div>
          <Menu
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

function Menu({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: "men" | "women" | undefined;
  setActiveCategory: (category: "men" | "women" | undefined) => void;
}) {
  const { dictionary } = useDataContext();
  const { defaultValue: category } = useFilterQueryParams("category");
  const { defaultValue: currentGender } = useFilterQueryParams("gender");
  const categoriesGroups = groupCategories(
    dictionary?.categories?.map((v) => v.name as string) || [],
  );

  const selectedCategories = category?.split(",") || [];
  const genderCategories =
    currentGender === GENDER_MAP[activeCategory!] ? selectedCategories : [];
  const isSelectedCategory = (id: string) => genderCategories.includes(id);

  const getViewAllHref = (items: { id: string }[]) => {
    const groupCategoryIds = items.map((item) => item.id);
    return `/catalog?category=${encodeURIComponent(groupCategoryIds.join(","))}&gender=${GENDER_MAP[activeCategory!]}`;
  };

  const getNewHref = (id: string) => {
    const newCategories = isSelectedCategory(id)
      ? genderCategories.filter((v) => v !== id)
      : [...genderCategories, id];

    return `/catalog?category=${encodeURIComponent(newCategories.join(","))}&gender=${GENDER_MAP[activeCategory!]}`;
  };

  return (
    <div className="flex h-full grow flex-col justify-between overflow-y-auto bg-bgColor p-2">
      {activeCategory === undefined ? (
        <>
          <div className="space-y-6">
            <div className="space-y-6 border-b border-dashed border-textColor pb-6">
              <Button
                onClick={() => setActiveCategory("men")}
                className="w-full"
              >
                <div className="flex items-center justify-between">
                  <Text variant="uppercase">men</Text>
                  <Text variant="uppercase">{">"}</Text>
                </div>
              </Button>
              <Button
                onClick={() => setActiveCategory("women")}
                className="w-full"
              >
                <div className="flex items-center justify-between">
                  <Text variant="uppercase">women</Text>
                  <Text variant="uppercase">{">"}</Text>
                </div>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Button asChild>
                <Link href="/archive">
                  <Text variant="uppercase">archive</Text>
                </Link>
              </Button>
              <Text variant="uppercase">{">"}</Text>
            </div>
            <CurrencyPopover align="start" title="Currency:" />
          </div>

          <NewslatterForm />
        </>
      ) : (
        <div className="grow space-y-6">
          {Object.entries(categoriesGroups).map(([key, category]) => (
            <div
              key={key}
              className="grid w-full grid-cols-2 gap-2 border-b border-dashed border-textColor pb-6"
            >
              <Text variant="uppercase" className="text-xl">
                {category.title}
              </Text>
              <div className="space-y-4">
                <DialogPrimitives.Close asChild>
                  <Button variant="simpleReverse" asChild>
                    <Link href={getViewAllHref(category.items)}>view all</Link>
                  </Button>
                </DialogPrimitives.Close>
                {category.items.map((item) => (
                  <DialogPrimitives.Close key={item.id} asChild>
                    <Button
                      variant={
                        isSelectedCategory(item.id) ? "simple" : "simpleReverse"
                      }
                      asChild
                    >
                      <Link href={getNewHref(item.id)}>
                        {item.label.toLowerCase()}
                      </Link>
                    </Button>
                  </DialogPrimitives.Close>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
