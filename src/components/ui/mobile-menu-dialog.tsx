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

import { useDataContext } from "../DataContext";
import { Button } from "./button";
import Image from "./image";
import { Text } from "./text";

// export function MobileMenuDialog({
//   activeCategory,
//   setActiveCategory,
// }: {
//   activeCategory: "men" | "women" | undefined;
//   setActiveCategory: (category: "men" | "women" | undefined) => void;
// }) {
//   return (
//     <DialogPrimitives.Root>
//       <DialogPrimitives.Trigger asChild>
//         <Button size="sm" variant={"simpleReverse"}>
//           menu
//         </Button>
//       </DialogPrimitives.Trigger>
//       <DialogPrimitives.Portal>
//         <DialogPrimitives.Overlay className="fixed inset-0 z-30 bg-textColor" />
//         <DialogPrimitives.Content className="fixed left-0 top-0 z-30 flex h-screen w-screen flex-col bg-bgColor px-2.5 py-5 text-textColor">
//           <DialogPrimitives.Title className="sr-only">
//             grbpwr mobile menu
//           </DialogPrimitives.Title>
//           <div className="flex h-full flex-col">
//             <div className="mb-16">
//               {activeCategory ? (
//                 <div className="flex items-center justify-between">
//                   <Button onClick={() => setActiveCategory(undefined)}>
//                     <Text>{"<"}</Text>
//                   </Button>
//                   <Text variant="uppercase" className="basis-0">
//                     {activeCategory}
//                   </Text>
//                   <Button className="leading-none">[X]</Button>
//                 </div>
//               ) : (
//                 <DialogPrimitives.Close asChild>
//                   <div className="flex w-full items-center justify-between">
//                     <div className="aspect-square size-7">
//                       <WhiteLogo />
//                     </div>
//                     <Button className="leading-none">[X]</Button>
//                   </div>
//                 </DialogPrimitives.Close>
//               )}
//             </div>
//             <Menu
//               activeCategory={activeCategory}
//               setActiveCategory={setActiveCategory}
//             />
//           </div>
//         </DialogPrimitives.Content>
//       </DialogPrimitives.Portal>
//     </DialogPrimitives.Root>
//   );
// }

// function Menu({
//   activeCategory,
//   setActiveCategory,
// }: {
//   activeCategory: "men" | "women" | undefined;
//   setActiveCategory: (category: "men" | "women" | undefined) => void;
// }) {
//   const { hero } = useDataContext();
//   const { dictionary } = useDataContext();
//   const heroNav = activeCategory
//     ? hero?.navFeatured?.[activeCategory]
//     : undefined;
//   const isTagLink = heroNav?.featuredTag;
//   const newIn = `/catalog?order=ORDER_FACTOR_DESC&sort=SORT_FACTOR_CREATED_AT`;
//   const tagLink = `/catalog?tag=${heroNav?.featuredTag}`;
//   const archiveLink = `/archive?id=${heroNav?.featuredArchiveId}`;

//   const processedCategories = dictionary?.categories
//     ? processCategories(dictionary.categories)
//     : [];

//   const objectsCategoryId =
//     dictionary?.categories?.find((cat) => cat.name?.toLowerCase() === "objects")
//       ?.id || "";

//   const categoryLinks = processedCategories.map((category) => ({
//     title: category.name,
//     href: category.href,
//     id: category.id.toString(),
//   }));

//   const { leftSideCategoryLinks, rightSideCategoryLinks } =
//     filterNAvigationLinks(categoryLinks);

//   return (
//     <div className="flex h-full flex-col justify-between overflow-y-auto">
//       {activeCategory === undefined ? (
//         <>
//           <div className="space-y-10">
//             <div className="space-y-5">
//               <Button
//                 onClick={() => setActiveCategory("men")}
//                 className="w-full"
//               >
//                 <div className="flex items-center justify-between">
//                   <Text variant="uppercase">men</Text>
//                   <Text variant="uppercase">{">"}</Text>
//                 </div>
//               </Button>
//               <Button
//                 onClick={() => setActiveCategory("women")}
//                 className="w-full"
//               >
//                 <div className="flex items-center justify-between">
//                   <Text variant="uppercase">women</Text>
//                   <Text variant="uppercase">{">"}</Text>
//                 </div>
//               </Button>

//               <div className="flex flex-col items-start gap-5">
//                 <DialogPrimitives.Close>
//                   <Button asChild>
//                     <Link href={`/catalog?topCategoryIds=${objectsCategoryId}`}>
//                       <Text variant="uppercase">objects</Text>
//                     </Link>
//                   </Button>
//                 </DialogPrimitives.Close>
//                 <DialogPrimitives.Close>
//                   <Button asChild>
//                     <Link href="/archive">
//                       <Text variant="uppercase">archive</Text>
//                     </Link>
//                   </Button>
//                 </DialogPrimitives.Close>
//               </div>
//             </div>

//             <CurrencyPopover align="start" title="Currency:" />
//           </div>

//           <NewslatterForm />
//         </>
//       ) : (
//         <div className="grow space-y-10">
//           <Button asChild className="uppercase">
//             <Link href={newIn}>new in</Link>
//           </Button>
//           <div className="space-y-5">
//             <Button asChild className="uppercase">
//               <Link href="/catalog">garments</Link>
//             </Button>
//             {leftSideCategoryLinks.map((link) => (
//               <div key={link.id}>
//                 <Button asChild>
//                   <Link
//                     href={`${link.href}&gender=${GENDER_MAP[activeCategory]}`}
//                   >
//                     {CATEGORY_TITLE_MAP[link.title] || link.title}
//                   </Link>
//                 </Button>
//               </div>
//             ))}
//           </div>
//           <div className="space-y-5">
//             {rightSideCategoryLinks.map((link) => (
//               <div key={link.id}>
//                 <Button asChild className="uppercase">
//                   <Link
//                     href={`${link.href}&gender=${GENDER_MAP[activeCategory]}`}
//                   >
//                     {link.title}
//                   </Link>
//                 </Button>
//               </div>
//             ))}
//           </div>
//           <div className="w-full">
//             <Button asChild>
//               <Link
//                 href={isTagLink ? tagLink : archiveLink}
//                 className="space-y-2"
//               >
//                 <div className="w-full">
//                   <Image
//                     src={heroNav?.media?.media?.thumbnail?.mediaUrl || ""}
//                     alt="mobile hero nav"
//                     aspectRatio={calculateAspectRatio(
//                       heroNav?.media?.media?.thumbnail?.width,
//                       heroNav?.media?.media?.thumbnail?.height,
//                     )}
//                   />
//                 </div>
//                 <Text>{heroNav?.exploreText}</Text>
//               </Link>
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
            <Link href="/catalog">garments</Link>
          </Button>
        </DialogPrimitives.Close>
        {leftSideCategoryLinks.map((link) => (
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
