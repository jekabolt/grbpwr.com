import Link from "next/link";
import { GENDER_MAP } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import {
  CATEGORY_TITLE_MAP,
  filterNavigationLinks,
  processCategories,
} from "@/lib/categories-map";
import { calculateAspectRatio } from "@/lib/utils";
import CurrencyPopover from "@/app/_components/mobile-currency-popover";
import NewslatterForm from "@/app/_components/newslatter-form";

import { useDataContext } from "../contexts/DataContext";
import { Button } from "./button";
import Image from "./image";
import { Text } from "./text";

interface DefaultMenuProps {
  setActiveCategory: (category: "men" | "women" | undefined) => void;
}

export function DefaultMobileMenuDialog({
  setActiveCategory,
}: DefaultMenuProps) {
  const { dictionary } = useDataContext();
  const objectsCategoryId =
    dictionary?.categories?.find((c) => c.name?.toLowerCase() === "objects")
      ?.id || "";

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <Button
            className="flex items-center justify-between"
            onClick={() => setActiveCategory("men")}
          >
            <Text variant="uppercase">men</Text>
            <Text variant="uppercase">{">"}</Text>
          </Button>
          <Button
            className="flex items-center justify-between"
            onClick={() => setActiveCategory("women")}
          >
            <Text variant="uppercase">women</Text>
            <Text variant="uppercase">{">"}</Text>
          </Button>
          <DialogPrimitives.Close asChild>
            <Button asChild className="uppercase">
              <Link href={`/catalog?topCategoryIds=${objectsCategoryId}`}>
                objects
              </Link>
            </Button>
          </DialogPrimitives.Close>
          <DialogPrimitives.Close asChild>
            <Button asChild className="uppercase">
              <Link href="/archive">archive</Link>
            </Button>
          </DialogPrimitives.Close>
        </div>
        <div className="self-start">
          <CurrencyPopover title="currency:" />
        </div>
      </div>
      <NewslatterForm />
    </div>
  );
}

interface ActiveCategoryMenuProps {
  activeCategory: "men" | "women" | undefined;
}

export function ActiveCategoryMenuDialog({
  activeCategory,
}: ActiveCategoryMenuProps) {
  const { dictionary } = useDataContext();
  const { hero } = useDataContext();
  const heroNav = activeCategory
    ? hero?.navFeatured?.[activeCategory]
    : undefined;

  const newIn = `/catalog?order=ORDER_FACTOR_DESC&sort=SORT_FACTOR_CREATED_AT`;
  const isTagLinkExist = heroNav?.featuredTag;
  const tagLink = `/catalog?tag=${heroNav?.featuredTag}`;
  const archiveLink = `/archive?id=${heroNav?.featuredArchiveId}`;
  const activeHeroNavLink = isTagLinkExist ? tagLink : archiveLink;

  const categories = processCategories(dictionary?.categories || []);
  const categoryLinks = categories.map((category) => ({
    title: category.name,
    href: category.href,
    id: category.id.toString(),
  }));

  const { leftSideCategoryLinks, rightSideCategoryLinks } =
    filterNavigationLinks(categoryLinks);

  const filteredLeftSideCategories =
    activeCategory === "men"
      ? leftSideCategoryLinks.filter((c) => c.title.toLowerCase() !== "dresses")
      : leftSideCategoryLinks;

  return (
    <div className="flex h-full flex-col gap-10 overflow-y-auto">
      <DialogPrimitives.Close asChild>
        <Button asChild className="uppercase">
          <Link href={newIn}>new in</Link>
        </Button>
      </DialogPrimitives.Close>
      <div className="flex flex-col gap-5">
        <DialogPrimitives.Close asChild>
          <Button asChild className="uppercase">
            <Link href={`/catalog?gender=${GENDER_MAP[activeCategory || ""]}`}>
              all
            </Link>
          </Button>
        </DialogPrimitives.Close>
        {filteredLeftSideCategories.map((link) => (
          <DialogPrimitives.Close asChild key={link.id}>
            <Button asChild>
              <Link
                href={`${link.href}&gender=${GENDER_MAP[activeCategory || ""]}`}
              >
                {CATEGORY_TITLE_MAP[link.title] || link.title}
              </Link>
            </Button>
          </DialogPrimitives.Close>
        ))}
      </div>
      <div className="flex flex-col gap-5">
        {rightSideCategoryLinks.map((link) => (
          <DialogPrimitives.Close asChild key={link.id}>
            <Button asChild className="uppercase">
              <Link
                href={`${link.href}&gender=${GENDER_MAP[activeCategory || ""]}`}
              >
                {link.title}
              </Link>
            </Button>
          </DialogPrimitives.Close>
        ))}
      </div>
      <div className="w-full">
        <Button asChild>
          <Link href={activeHeroNavLink} className="space-y-2">
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
  );
}
