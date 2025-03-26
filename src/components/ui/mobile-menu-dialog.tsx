import Link from "next/link";
import { GENDER_MAP } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import {
  CATEGORY_TITLE_MAP,
  filterNAvigationLinks,
  processCategories,
} from "@/lib/categories-map";
import { calculateAspectRatio } from "@/lib/utils";
import CurrencyPopover from "@/app/_components/currency-popover";
import NewslatterForm from "@/app/_components/newslatter-form";

import { useDataContext } from "../DataContext";
import { Button } from "./button";
import { WhiteLogo } from "./icons/white-logo";
import Image from "./image";
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
        <Button size="sm" variant={"simpleReverse"}>
          menu
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-30 bg-textColor" />
        <DialogPrimitives.Content className="fixed left-0 top-0 z-30 flex h-screen w-screen flex-col bg-bgColor px-2.5 py-5 text-textColor">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="flex h-full flex-col">
            <div className="mb-16">
              {activeCategory ? (
                <div className="flex items-center justify-between">
                  <Button onClick={() => setActiveCategory(undefined)}>
                    <Text>{"<"}</Text>
                  </Button>
                  <Text variant="uppercase" className="basis-0">
                    {activeCategory}
                  </Text>
                  <Button className="leading-none">[X]</Button>
                </div>
              ) : (
                <DialogPrimitives.Close asChild>
                  <div className="flex w-full items-center justify-between">
                    <div className="aspect-square size-7">
                      <WhiteLogo />
                    </div>
                    <Button className="leading-none">[X]</Button>
                  </div>
                </DialogPrimitives.Close>
              )}
            </div>
            <Menu
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>
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
  const { hero } = useDataContext();
  const { dictionary } = useDataContext();
  const heroNav = activeCategory
    ? hero?.navFeatured?.[activeCategory]
    : undefined;
  const isTagLink = heroNav?.featuredTag;
  const newIn = `/catalog?order=ORDER_FACTOR_DESC&sort=SORT_FACTOR_CREATED_AT`;
  const tagLink = `/catalog?tag=${heroNav?.featuredTag}`;
  const archiveLink = `/archive?id=${heroNav?.featuredArchiveId}`;

  const processedCategories = dictionary?.categories
    ? processCategories(dictionary.categories)
    : [];

  const objectsCategoryId =
    dictionary?.categories?.find((cat) => cat.name?.toLowerCase() === "objects")
      ?.id || "";

  const categoryLinks = processedCategories.map((category) => ({
    title: category.name,
    href: category.href,
    id: category.id.toString(),
  }));

  const { leftSideCategoryLinks, rightSideCategoryLinks } =
    filterNAvigationLinks(categoryLinks);

  return (
    <div className="flex h-full flex-col justify-between overflow-y-auto">
      {activeCategory === undefined ? (
        <>
          <div className="space-y-10">
            <div className="space-y-5">
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

              <div className="flex flex-col items-start gap-5">
                <DialogPrimitives.Close>
                  <Button asChild>
                    <Link href={`/catalog?topCategoryIds=${objectsCategoryId}`}>
                      <Text variant="uppercase">objects</Text>
                    </Link>
                  </Button>
                </DialogPrimitives.Close>
                <DialogPrimitives.Close>
                  <Button asChild>
                    <Link href="/archive">
                      <Text variant="uppercase">archive</Text>
                    </Link>
                  </Button>
                </DialogPrimitives.Close>
              </div>
            </div>

            <CurrencyPopover align="start" title="Currency:" />
          </div>

          <NewslatterForm />
        </>
      ) : (
        <div className="grow space-y-10">
          <Button asChild className="uppercase">
            <Link href={newIn}>new in</Link>
          </Button>
          <div className="space-y-5">
            <Button asChild className="uppercase">
              <Link href="/catalog">garments</Link>
            </Button>
            {leftSideCategoryLinks.map((link) => (
              <div key={link.id}>
                <Button asChild>
                  <Link
                    href={`${link.href}&gender=${GENDER_MAP[activeCategory]}`}
                  >
                    {CATEGORY_TITLE_MAP[link.title] || link.title}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            {rightSideCategoryLinks.map((link) => (
              <div key={link.id}>
                <Button asChild className="uppercase">
                  <Link
                    href={`${link.href}&gender=${GENDER_MAP[activeCategory]}`}
                  >
                    {link.title}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="w-full">
            <Button asChild>
              <Link
                href={isTagLink ? tagLink : archiveLink}
                className="space-y-2"
              >
                <div className="w-full">
                  <Image
                    src={heroNav?.media?.media?.thumbnail?.mediaUrl || ""}
                    alt="mobile hero nav"
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
      )}
    </div>
  );
}
