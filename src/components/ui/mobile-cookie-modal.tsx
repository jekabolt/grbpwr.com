import * as DialogPrimitives from "@radix-ui/react-dialog";

import { Text } from "@/components/ui/text";
import { CookieContent } from "@/app/(content)/privacy-policy/cookie-content";

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
  if (!isVisible) return null;

  return (
    <DialogPrimitives.Root>
      <div className="flex flex-col items-start gap-6 p-2.5">
        <Text className="tracking-wider">
          we use cookies to enhance the functionality of the website.You can
          disable cookies in your browser settings.
          <DialogPrimitives.Trigger asChild>
            <Button variant="underline" className="inline">
              cookie preferences
            </Button>
          </DialogPrimitives.Trigger>
        </Text>
        <Button
          variant="secondary"
          onClick={handleSaveCookies}
          size="lg"
          className="uppercase"
        >
          Accept
        </Button>
      </div>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-10 bg-overlay" />
        <DialogPrimitives.Content className="fixed inset-0 z-30 flex flex-col gap-4 bg-bgColor py-4">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="flex items-center justify-between px-5">
            <Text variant="uppercase">Cookie preferences</Text>
            <DialogPrimitives.Close asChild>
              <Button>[X]</Button>
            </DialogPrimitives.Close>
          </div>

          <div className="no-scroll-bar border-textInactiveColor-500 overflow-y-auto border-b border-solid px-5">
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
                Accept all cookies
              </Button>
            </DialogPrimitives.Close>
            <DialogPrimitives.Close asChild>
              <Button
                variant="simpleReverse"
                onClick={handleSaveCookies}
                size="lg"
                className="w-full uppercase"
              >
                Save preferences
              </Button>
            </DialogPrimitives.Close>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
