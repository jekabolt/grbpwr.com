"use client";

import { common_SizeEnum } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";

export function MobileSize() {
  const { dictionary } = useDataContext();
  const { defaultValue, handleFilterChange } = useFilterQueryParams("size");
  const sordedSizes = dictionary?.sizes?.sort((a, b) => {
    return (a.id || 0) - (b.id || 0);
  });
  const sizeNames = sordedSizes?.map((size) => {
    return {
      ...size,
      name: size.name?.replace("SIZE_ENUM_", "") as common_SizeEnum,
    };
  });

  return (
    <DialogPrimitives.Root modal={false}>
      <DialogPrimitives.Trigger asChild>
        <Button className="uppercase">size +</Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed bottom-0 left-0 z-40 bg-black" />
        <DialogPrimitives.Content className="blackTheme fixed bottom-0 left-0 z-40 flex h-auto w-screen flex-col bg-black p-2 text-textColor">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="relative mb-4 flex items-center justify-between">
            <Text variant="uppercase">size</Text>
            <DialogPrimitives.Close asChild>
              <Button>[X]</Button>
            </DialogPrimitives.Close>
          </div>

          <div className="grid grid-cols-4 gap-x-2 gap-y-6 py-6">
            <FilterOptionButtons
              defaultValue={defaultValue || ""}
              handleFilterChange={handleFilterChange}
              values={sizeNames || []}
            />
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
