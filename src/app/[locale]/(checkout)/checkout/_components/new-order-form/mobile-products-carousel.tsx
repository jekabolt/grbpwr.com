"use client";

import Link from "next/link";
import type { common_OrderItem } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { isDateTodayOrFuture } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import CartItemSize from "@/app/[locale]/(checkout)/cart/_components/CartItemSize";
import { getPreorderDate } from "@/app/[locale]/(checkout)/cart/_components/utils";

function MobileOrderItemRow({
  product,
  currencyKey: currencyKeyProp,
}: {
  product: common_OrderItem;
  currencyKey?: string;
}) {
  const { languageId, currentCountry } = useTranslationsStore((state) => state);
  const currencyKey =
    currencyKeyProp || currentCountry.currencyKey?.toUpperCase() || "EUR";
  const currencySymbol = currencySymbols[currencyKey] || currencySymbols.EUR;
  const isSaleApplied = parseInt(product?.productSalePercentage || "0");
  const priceWithoutSale = `${currencySymbol}  ${product?.productPrice}`;
  const priceWithSale = `${currencySymbol} ${product?.productPriceWithSale}`;
  const t = useTranslations("product");
  const tColors = useTranslations("colors");

  if (!product) return null;

  const preorderDate = getPreorderDate(product, t);
  const rawPreorderDate = product.preorder;
  const productName = product.translations?.find(
    (t) => t.languageId === languageId,
  )?.name;

  return (
    <Button asChild>
      <Link href={product.slug || ""}>
        <div className="relative flex gap-x-3 border-b border-solid border-textInactiveColor py-6 text-textColor first:pt-0 last:border-b-0">
          <div className="min-w-[90px]">
            <Image
              src={product.thumbnail || ""}
              alt="product"
              fit="contain"
              aspectRatio="3/4"
            />
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-full flex-col justify-between">
              <div className="space-y-3">
                <Text
                  className="line-clamp-1 overflow-hidden text-ellipsis"
                  variant="uppercase"
                >
                  {productName}
                </Text>
                <div>
                  <Text variant="uppercase">
                    {tColors(product.color || "")}
                  </Text>
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
            </div>
            <div className="flex w-full flex-col items-end justify-end gap-3">
              <div className="flex items-center whitespace-nowrap">
                {isSaleApplied ? (
                  <div className="flex items-center gap-x-2">
                    <Text variant="strileTroughInactive">
                      {priceWithoutSale}
                    </Text>
                    <Text>{priceWithSale}</Text>
                  </div>
                ) : (
                  <Text>{priceWithoutSale}</Text>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Button>
  );
}

export function MobileProductsCarousel({
  validatedProducts,
  currencyKey,
}: Props) {
  return (
    <div>
      {validatedProducts?.map((p, i) => (
        <MobileOrderItemRow
          key={p?.id + "" + p?.orderId + i}
          product={p}
          currencyKey={currencyKey}
        />
      ))}
    </div>
  );
}

interface Props {
  validatedProducts?: common_OrderItem[];
  /** When provided (e.g. order confirmation), use this currency instead of user's current locale */
  currencyKey?: string;
}
