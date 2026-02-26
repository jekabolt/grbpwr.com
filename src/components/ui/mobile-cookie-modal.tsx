import { useState } from "react";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { Text } from "@/components/ui/text";
import { CookieContent } from "@/app/[locale]/(content)/_components/cookie-content";

import { ModalTransition } from "../modal-transition";
import { Button } from "./button";

interface Props {
  isVisible: boolean;
  preferences: {
    functional: boolean;
    statistical: boolean;
    advertising_social_media: boolean;
    experience: boolean;
  };
  handleSaveCookies: () => void;
  handlePreferenceChange: (key: string, value: boolean) => void;
}

export function MobileCookieModal({
  isVisible,
  preferences,
  handleSaveCookies,
  handlePreferenceChange,
}: Props) {
  const t = useTranslations("cookies");
  const tAccessibility = useTranslations("accessibility");
  const [open, setOpen] = useState(false);

  if (!isVisible) return null;

  return (
    <>
      <DialogPrimitives.Root open={open} onOpenChange={setOpen}>
        <div className="flex flex-col items-start gap-6 p-2.5">
          <Text className="tracking-wider">
            {t("cookies title")}
            <DialogPrimitives.Trigger asChild>
              <Button variant="underline" className="inline">
                {t("cookie preferences")}
              </Button>
            </DialogPrimitives.Trigger>
          </Text>
          <Button
            variant="secondary"
            onClick={handleSaveCookies}
            size="lg"
            className="uppercase"
          >
            {t("accept")}
          </Button>
        </div>
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay className="fixed inset-0 z-10 h-screen bg-overlay" />
          <ModalTransition
            isOpen={open}
            contentSlideFrom="bottom"
            contentClassName="fixed inset-x-2 bottom-2 top-2 z-30 flex flex-col gap-4 border border-textInactiveColor bg-bgColor py-4 text-textColor"
            content={
              <DialogPrimitives.Content className="flex h-full flex-col gap-4">
                <DialogPrimitives.Title className="sr-only">
                  {tAccessibility("mobile menu")}
                </DialogPrimitives.Title>
                <div className="flex items-center justify-between px-5">
                  <Text variant="uppercase">{t("cookie preferences")}</Text>
                  <DialogPrimitives.Close asChild>
                    <Button>[x]</Button>
                  </DialogPrimitives.Close>
                </div>

                <div className="overflow-y-auto px-5">
                  <CookieContent
                    preferences={preferences}
                    onPreferenceChange={handlePreferenceChange}
                  />
                </div>

                <div className="flex flex-col gap-2 px-2.5">
                  <DialogPrimitives.Close asChild>
                    <Button
                      variant="main"
                      onClick={handleSaveCookies}
                      size="lg"
                      className="w-full uppercase"
                    >
                      {t("accept all cookies")}
                    </Button>
                  </DialogPrimitives.Close>
                  <DialogPrimitives.Close asChild>
                    <Button
                      variant="simpleReverse"
                      onClick={handleSaveCookies}
                      size="lg"
                      className="w-full uppercase"
                    >
                      {t("save preferences")}
                    </Button>
                  </DialogPrimitives.Close>
                </div>
              </DialogPrimitives.Content>
            }
          />
        </DialogPrimitives.Portal>
      </DialogPrimitives.Root>
    </>
  );
}
