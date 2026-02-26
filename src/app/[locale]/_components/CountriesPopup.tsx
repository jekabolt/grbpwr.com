"use client";

import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { ModalTransition } from "@/components/modal-transition";

import { CountriesContent } from "./CountriesContent";
import { MobileCountriesPopup } from "./mobile-countries-popup";

export function CountriesPopup() {
  const { isOpen, closeCountryPopup } = useTranslationsStore((s) => s);

  return (
    <>
      <MobileCountriesPopup />
      <div className="hidden lg:block">
        <DialogPrimitives.Root
          open={isOpen}
          onOpenChange={(open) => !open && closeCountryPopup()}
        >
          <DialogPrimitives.Portal>
            <DialogPrimitives.Overlay className="fixed inset-0 z-30 h-screen bg-overlay" />
            <ModalTransition
              isOpen={isOpen}
              contentSlideFrom="right"
              contentClassName="fixed inset-y-2 right-2 z-30 w-[460px] border border-textInactiveColor bg-bgColor p-2.5 text-textColor"
              content={<CountriesContent />}
            />
          </DialogPrimitives.Portal>
        </DialogPrimitives.Root>
      </div>
    </>
  );
}
