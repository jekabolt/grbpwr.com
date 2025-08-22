import {
  calculateAspectRatio,
  createActiveCategoryMenuItems,
  createMenuItems,
  getCategoryDisplayName,
  getHeroNavLink,
} from "@/lib/utils";
import CurrencyPopover from "@/app/_components/mobile-currency-popover";
import NewslatterForm from "@/app/_components/newslatter-form";

import { useDataContext } from "../contexts/DataContext";
import { AnimatedButton } from "./animated-button";
import Image from "./image";
import { Text } from "./text";

type Gender = "men" | "women" | undefined;

interface DefaultMenuProps {
  isBigMenuEnabled: boolean | undefined;
  setActiveCategory: (category: Gender) => void;
}

interface ActiveCategoryMenuProps {
  activeCategory: Gender;
}

export function DefaultMobileMenuDialog({
  setActiveCategory,
  isBigMenuEnabled,
}: DefaultMenuProps) {
  const defaultMenuItems = createMenuItems(isBigMenuEnabled, setActiveCategory);

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          {defaultMenuItems.map((item) => (
            <div key={item.label} className="w-full">
              {isBigMenuEnabled ? (
                <AnimatedButton
                  className="flex w-full items-center justify-between uppercase"
                  onClick={item.action}
                >
                  <Text>{item.label}</Text>
                  {item.showArrow && <Text>{">"}</Text>}
                </AnimatedButton>
              ) : (
                <AnimatedButton href={item.href}>
                  <Text>{item.label}</Text>
                  {item.showArrow && <Text>{">"}</Text>}
                </AnimatedButton>
              )}
            </div>
          ))}
        </div>
        <div className="self-start">
          <CurrencyPopover title="currency:" />
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
        href="/catalog?order=ORDER_FACTOR_DESC&sort=SORT_FACTOR_CREATED_AT"
        className="uppercase"
      >
        new in
      </AnimatedButton>
      <div className="flex flex-col gap-5">
        <AnimatedButton
          href={`/catalog/${activeCategory}`}
          className="uppercase"
        >
          all
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
            <Text>{heroNav.exploreText}</Text>
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
  return (
    <AnimatedButton
      key={link.id}
      href={`/catalog/${activeCategory}/${link.title.toLowerCase()}`}
      className="uppercase"
    >
      {getCategoryDisplayName(link.title)}
    </AnimatedButton>
  );
}
