"use client";

import Link from "next/link";
import type { common_OrderItem } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";

import { formatPrice } from "@/lib/currency";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";
import { getPreorderDate } from "@/app/[locale]/(checkout)/cart/_components/utils";

import CartItemSize from "../../../cart/_components/CartItemSize";

function MobileOrderItemRow({
  product,
  currencyKey: currencyKeyProp,
  disabled = false,
  disableProductLinks = false,
}: {
  product: common_OrderItem;
  currencyKey?: string;
  disabled?: boolean;
  disableProductLinks?: boolean;
}) {
  const { languageId } = useTranslationsStore((state) => state);
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

  const row = (
    <div className="relative flex gap-x-3 border-b border-solid border-textInactiveColor py-6 text-textColor first:pt-0 last:border-b-0">
      <div className="relative min-w-[90px]">
        <Image
          src={product.thumbnail || ""}
          alt="product"
          fit="contain"
          aspectRatio="3/4"
        />
        {disabled && (
          <div className="absolute inset-0">
            <Overlay cover="container" color="highlight" disabled={disabled} />
          </div>
        )}
      </div>
      <div
        className={cn("flex min-w-0 flex-1 justify-between gap-x-3", {
          "text-textInactiveColor": disabled,
        })}
      >
        <div className="flex w-full flex-col gap-3">
          <Text
            className="line-clamp-1 overflow-hidden text-ellipsis"
            variant="uppercase"
          >
            {productName}
          </Text>
          <div className="flex h-full flex-row">
            <div className="w-full">
              <Text variant="uppercase">{tColors(product.color || "")}</Text>
              <CartItemSize sizeId={product.orderItem?.sizeId + ""} />
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
      </div>
    </div>
  );

  if (disableProductLinks) {
    return row;
  }

  return (
    <Button asChild>
      <Link href={product.slug || ""}>{row}</Link>
    </Button>
  );
}

export function MobileProductsCarousel({
  validatedProducts,
  currencyKey,
  disabled = false,
  disableProductLinks = false,
}: Props) {
  const cartProducts = useCart((s) => s.products)
    .map((v) => v.productData)
    .filter(Boolean) as common_OrderItem[];
  const products = validatedProducts ?? cartProducts;

  return (
    <div>
      {products?.map((p, i) => (
        <MobileOrderItemRow
          key={p?.id + "" + p?.orderId + i}
          product={p}
          currencyKey={currencyKey}
          disabled={disabled}
          disableProductLinks={disableProductLinks}
        />
      ))}
    </div>
  );
}

interface Props {
  validatedProducts?: common_OrderItem[];
  currencyKey?: string;
  disabled?: boolean;
  disableProductLinks?: boolean;
}
