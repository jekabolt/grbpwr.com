import Link from "next/link";
import type { common_OrderItem } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";

import { formatPrice } from "@/lib/currency";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn, isDateTodayOrFuture } from "@/lib/utils";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import CartItemSize from "./CartItemSize";
import ProductRemoveButton from "./ProductRemoveButton";
import { getPreorderDate } from "./utils";

export default function ItemRow({
  product,
  hideQuantityButtons,
  index,
  currencyKey: currencyKeyProp,
}: Props) {
  const { languageId } = useTranslationsStore((state) => state);
  const closeCart = useCart((state) => state.closeCart);
  const validatedCurrency = useCart((state) => state.validatedCurrency);
  const currencyKey =
    currencyKeyProp || validatedCurrency?.toUpperCase() || "EUR";
  const currencySymbol = currencySymbols[currencyKey] || currencySymbols.EUR;
  const isSaleApplied = parseInt(product?.productSalePercentage || "0");
  const priceWithoutSale = formatPrice(
    product?.productPrice || "0",
    currencyKey,
    currencySymbol,
  );
  const priceWithSale = formatPrice(
    product?.productPriceWithSale || "0",
    currencyKey,
    currencySymbol,
  );
  const t = useTranslations("product");
  const tColors = useTranslations("colors");

  if (!product) return null;

  const preorderDate = getPreorderDate(product, t);
  const rawPreorderDate = product.preorder;
  const productName = product.translations?.find(
    (t) => t.languageId === languageId,
  )?.name;

  return (
    <div className="relative flex gap-x-3 border-b border-solid border-textInactiveColor py-6 text-textColor first:pt-0 last:border-b-0">
      <Link
        href={product.slug || ""}
        className="group relative h-full min-w-[90px] shrink-0"
        onClick={closeCart}
      >
        <Image
          src={product.thumbnail || ""}
          alt="product"
          fit="contain"
          aspectRatio="3/4"
        />
        <div className="absolute inset-0 hidden lg:block">
          <Overlay cover="container" color="highlight" trigger="hover" />
        </div>
      </Link>
      <div className="relative z-10 flex w-full items-stretch justify-between">
        <Link
          href={product.slug || ""}
          className="flex w-full flex-col justify-between"
          onClick={closeCart}
        >
          <div className="space-y-3">
            <Text
              className="line-clamp-1 overflow-hidden text-ellipsis"
              variant="uppercase"
            >
              {productName}
            </Text>
            <div>
              <Text variant="uppercase">{tColors(product.color || "")}</Text>
              <CartItemSize sizeId={product.orderItem?.sizeId + ""} />
            </div>
          </div>
          {preorderDate && isDateTodayOrFuture(rawPreorderDate || "") && (
            <Text
              variant="uppercase"
              className="whitespace-nowrap text-textInactiveColor"
            >
              {preorderDate}
            </Text>
          )}
        </Link>
        <div
          className={cn(
            "relative z-10 flex w-full flex-col items-end justify-between self-stretch",
            {
              "justify-end": hideQuantityButtons,
            },
          )}
        >
          {!hideQuantityButtons && (
            <ProductRemoveButton
              product={product}
              id={product.orderItem?.productId || 0}
              size={product.orderItem?.sizeId + "" || ""}
              index={index}
            />
          )}
          <div className="flex items-center justify-end whitespace-nowrap text-right">
            {isSaleApplied ? (
              <div className="flex items-center gap-x-2">
                <Text variant="strileTroughInactive">{priceWithoutSale}</Text>
                <Text>{priceWithSale}</Text>
              </div>
            ) : (
              <Text>{priceWithoutSale}</Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  product?: common_OrderItem;
  hideQuantityButtons?: boolean;
  index?: number;
  /** When provided (e.g. order confirmation), use this currency instead of user's current locale */
  currencyKey?: string;
};
