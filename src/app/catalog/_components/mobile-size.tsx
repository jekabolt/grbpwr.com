"use client";

import * as DialogPrimitives from "@radix-ui/react-dialog";

import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";

export function MobileSize() {
  const { dictionary } = useDataContext();
  const { defaultValue, handleFilterChange } = useFilterQueryParams("size");

  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <Button className="uppercase">size +</Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed bottom-0 left-0 z-20 bg-black" />
        <DialogPrimitives.Content className="blackTheme fixed bottom-0 left-0 z-20 flex h-[30vh] w-screen flex-col bg-black p-2.5">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="relative mb-4 flex items-center justify-between p-2">
            <Text variant="uppercase">size</Text>
            <DialogPrimitives.Close asChild>
              <Button className="bg-black text-textColor">[X]</Button>
            </DialogPrimitives.Close>
          </div>
          <div className="relative grow overflow-y-auto">
            <div className="space-y-2 text-white">
              <FilterOptionButtons
                defaultValue={defaultValue || ""}
                handleFilterChange={handleFilterChange}
                values={dictionary?.sizes || []}
                defaultOptionText="none"
              />
            </div>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
