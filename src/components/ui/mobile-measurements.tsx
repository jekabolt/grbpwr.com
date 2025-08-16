import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { Measurements } from "@/app/product/[...productParams]/_components/measurements";

import { Button } from "./button";
import { Text } from "./text";

export function MobileMeasurements({ id, product }: MobileMeasurementsProps) {
  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild className="text-left">
        <Button variant="underline" className="uppercase">
          size guide
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-10 bg-overlay" />
        <DialogPrimitives.Content className="fixed inset-0 z-50 flex h-full flex-col gap-4 overflow-y-auto bg-bgColor p-2.5">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="flex items-center justify-between">
            <Text variant="uppercase">size guide</Text>
            <DialogPrimitives.Close asChild>
              <Button>[X]</Button>
            </DialogPrimitives.Close>
          </div>
          <Measurements id={id} product={product} />
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

export type MobileMeasurementsProps = {
  id: number | undefined;
  product: common_ProductFull;
};
