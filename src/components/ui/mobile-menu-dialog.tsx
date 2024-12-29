import Link from "next/link";
import { GENDER_MAP } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { groupCategories } from "@/lib/categories-map";
import CurrencyPopover from "@/app/_components/currency-popover";
import NewslatterForm from "@/app/_components/newslatter-form";

import { useDataContext } from "../DataContext";
import { Button } from "./button";
import { Logo } from "./logo";
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
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 bg-textColor" />
        <DialogPrimitives.Content className="blackTheme fixed left-0 top-0 z-20 flex h-screen w-screen flex-col p-2 pb-10">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="relative mb-16 flex items-center justify-between gap-2 text-textColor">
            {activeCategory ? (
              <>
                <Button onClick={() => setActiveCategory(undefined)}>
                  <Text variant="uppercase">{"<"}</Text>
                </Button>
                <Text variant="uppercase" className="basis-0">
                  {activeCategory}
                </Text>
              </>
            ) : (
              <Logo className="inline-block" />
            )}
            <DialogPrimitives.Close asChild>
              <Button variant={"simple"}>[X]</Button>
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

  const categoriesGroups = groupCategories(
    dictionary?.categories?.map((v) => v.name as string) || [],
  );

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
            <CurrencyPopover />
          </div>

          <NewslatterForm />
        </>
      ) : (
        <div className="grow space-y-6">
          {Object.entries(categoriesGroups).map(([key, category]) => (
            <div
              key={key}
              className="grid w-full grid-cols-2 gap-2 space-y-4 border-b border-dashed border-textColor pb-6"
            >
              <Text variant="uppercase">{category.title}</Text>
              <div className="space-y-2">
                <DialogPrimitives.Close asChild>
                  <Button variant="simpleReverse" asChild>
                    <Link href="/catalog">view all</Link>
                  </Button>
                </DialogPrimitives.Close>
                {category.items.map((item) => (
                  <div key={item.id}>
                    <DialogPrimitives.Close asChild>
                      <Button variant="simpleReverse" asChild>
                        <Link
                          href={`${item.href}&gender=${GENDER_MAP[activeCategory]}`}
                        >
                          {item.label.toLowerCase()}
                        </Link>
                      </Button>
                    </DialogPrimitives.Close>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
