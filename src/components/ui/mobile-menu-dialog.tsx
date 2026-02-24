import { useTranslations } from "next-intl";

import { getTopCategoryName } from "@/lib/categories-map";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import {
  calculateAspectRatio,
  createActiveCategoryMenuItems,
  createMenuItems,
  getCategoryDisplayName,
  getHeroNavLink,
} from "@/lib/utils";
import { CountriesPopup } from "@/app/[locale]/_components/CountriesPopup";
import NewslatterForm from "@/app/[locale]/_components/newslatter-form";

import { useDataContext } from "../contexts/DataContext";
import { AnimatedButton } from "./animated-button";
import Image from "./image";
import { Text } from "./text";

type Gender = "men" | "women" | undefined;

interface DefaultMenuProps {
  isBigMenuEnabled: boolean | undefined;
  isWebsiteEnabled?: boolean;
  setActiveCategory: (category: Gender) => void;
}

interface ActiveCategoryMenuProps {
  activeCategory: Gender;
}

export function DefaultMobileMenuDialog({
  setActiveCategory,
  isBigMenuEnabled,
  isWebsiteEnabled = true,
}: DefaultMenuProps) {
  const defaultMenuItems = isWebsiteEnabled
    ? createMenuItems(isBigMenuEnabled, setActiveCategory)
    : [{ label: "timeline", showArrow: false, href: "/timeline" }];
  const t = useTranslations("navigation");

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          {defaultMenuItems.map((item) => (
            <div key={item.label} className="w-full">
              {isBigMenuEnabled && item.action ? (
                <AnimatedButton
                  animationDuration={1000}
                  animationArea="full-underline"
                  className="flex w-full items-center justify-between uppercase"
                  onClick={item.action}
                >
                  <Text>{t(item.label)}</Text>
                  {item.showArrow && <Text>{">"}</Text>}
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  animationDuration={1000}
                  animationArea="full-underline"
                  href={item.href}
                  className="flex w-full items-center justify-between uppercase"
                >
                  <Text>{t(item.label)}</Text>
                  {item.showArrow && <Text>{">"}</Text>}
                </AnimatedButton>
              )}
            </div>
          ))}
        </div>
        <div className="self-start">
          <CountriesPopup />
        </div>
      </div>
      <NewslatterForm />
    </div>
  );
}

export function ActiveCategoryMenuDialog({
  activeCategory,
}: ActiveCategoryMenuProps) {
  const { dictionary, hero } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);
  const t = useTranslations("navigation");

  const heroNav = activeCategory
    ? hero?.navFeatured?.[activeCategory]
    : undefined;
  const heroLink = getHeroNavLink(heroNav);
  const { leftCategories, rightCategories } = createActiveCategoryMenuItems(
    activeCategory,
    dictionary,
  );

  return (
    <div className="flex h-full flex-col gap-10 overflow-y-auto">
      <AnimatedButton
        animationArea="text"
        href="/catalog?order=ORDER_FACTOR_DESC&sort=SORT_FACTOR_CREATED_AT"
        className="uppercase"
      >
        {t("new in")}
      </AnimatedButton>
      <div className="flex flex-col gap-5">
        <AnimatedButton
          animationArea="text"
          href={`/catalog/${activeCategory}`}
          className="uppercase"
        >
          {t("all")}
        </AnimatedButton>
        {leftCategories.map((link) => (
          <CategoryButton
            key={link.id}
            link={link}
            activeCategory={activeCategory}
          />
        ))}
      </div>
      <div className="flex flex-col gap-5">
        {rightCategories.map((link) => (
          <CategoryButton
            key={link.id}
            link={link}
            activeCategory={activeCategory}
          />
        ))}
      </div>
      {heroNav?.media?.media?.thumbnail?.mediaUrl && (
        <div className="w-full">
          <AnimatedButton href={heroLink} className="space-y-2">
            <div className="w-full">
              <Image
                src={heroNav.media.media.thumbnail.mediaUrl}
                alt="mobile hero nav"
                aspectRatio={calculateAspectRatio(
                  heroNav.media.media.thumbnail.width,
                  heroNav.media.media.thumbnail.height,
                )}
              />
            </div>
            <Text>
              {heroNav.translations?.find((t) => t.languageId === languageId)
                ?.exploreText || heroNav.translations?.[0]?.exploreText}
            </Text>
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}

function CategoryButton({
  link,
  activeCategory,
}: {
  activeCategory: Gender;
  link: { title: string; id: string };
}) {
  const { dictionary } = useDataContext();
  const tCategories = useTranslations("categories");

  const categoryName = getTopCategoryName(
    dictionary?.categories || [],
    parseInt(link.id),
  );
  const categoryKey =
    categoryName === "loungewear_sleepwear"
      ? "loungewear_sleepwear"
      : categoryName?.toLowerCase() || link.title.toLowerCase();
  const translatedName = categoryKey
    ? tCategories(categoryKey)
    : getCategoryDisplayName(link.title);

  return (
    <AnimatedButton
      key={link.id}
      animationArea="text"
      href={`/catalog/${activeCategory}/${link.title.toLowerCase()}`}
      className="uppercase"
    >
      {translatedName || getCategoryDisplayName(link.title)}
    </AnimatedButton>
  );
}
