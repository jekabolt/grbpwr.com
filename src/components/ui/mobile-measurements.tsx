import {
  common_GenderEnum,
  common_ProductMeasurement,
  common_ProductSize,
} from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { Measurements } from "@/app/product/[...productParams]/_components/measurements";
import { MeasurementType } from "@/app/product/[...productParams]/_components/select-size-add-to-cart/useData";

import { Button } from "./button";
import { Text } from "./text";

export function MobileMeasurements({
  id,
  sizes,
  measurements,
  categoryId,
  subCategoryId,
  typeId,
  gender,
  preorder,
  isSaleApplied,
  priceMinusSale,
  priceWithSale,
  price,
  type,
}: MobileMeasurementsProps) {
  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild className="text-left">
        <Button variant="underline" className="uppercase">
          size guide
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-10 bg-overlay" />
        <DialogPrimitives.Content className="fixed inset-0 z-30 flex flex-col gap-4 bg-bgColor p-2.5">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="flex items-center justify-between">
            <Text variant="uppercase">size guide</Text>
            <DialogPrimitives.Close asChild>
              <Button>[X]</Button>
            </DialogPrimitives.Close>
          </div>
          <Measurements
            id={id}
            sizes={sizes}
            categoryId={categoryId}
            subCategoryId={subCategoryId}
            typeId={typeId}
            gender={gender}
            measurements={measurements}
            preorder={preorder || ""}
            isSaleApplied={isSaleApplied}
            priceMinusSale={priceMinusSale}
            priceWithSale={priceWithSale}
            price={price}
            type={type}
          />
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

export type MobileMeasurementsProps = {
  id: number | undefined;
  sizes: common_ProductSize[] | undefined;
  measurements: common_ProductMeasurement[];
  categoryId: number | undefined;
  subCategoryId: number | undefined;
  typeId: number | undefined;
  gender: common_GenderEnum | undefined;
  preorder: string;
  isSaleApplied: boolean;
  priceMinusSale: string;
  priceWithSale: string;
  price: string;
  type: MeasurementType;
};
