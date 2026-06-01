import { keyboardRestrictions } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { ModalTransition } from "@/components/modal-transition";
import { Button } from "@/components/ui/button";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import InputField from "@/components/ui/form/fields/input-field";
import { Text } from "@/components/ui/text";

import { NewArrivals } from "../../account/_components/new-arrivals";
import { NewsletterFormValues } from "./schema";

export function NewsletterPopup({
  open,
  isLoading = false,
  onOpenChange,
  onSubscribe,
}: {
  open: boolean;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe: () => void;
}) {
  const t = useTranslations("newslatter");
  const { dictionary } = useDataContext();
  const isWebsiteEnabled = dictionary?.siteEnabled;
  const form = useFormContext<NewsletterFormValues>();
  const shoppingPreference = useWatch({
    control: form.control,
    name: "shoppingPreference",
  });
  return (
    <DialogPrimitives.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 h-screen bg-overlay" />
        <ModalTransition
          isOpen={open}
          contentSlideFrom="none"
          contentClassName={cn(
            "fixed inset-x-2.5 top-1/2 z-50 flex h-auto w-auto -translate-y-1/2 flex-col border border-textInactiveColor bg-bgColor p-2.5 text-textColor lg:inset-x-auto lg:left-1/2 lg:w-80 lg:-translate-x-1/2",
            {
              blackTheme: !isWebsiteEnabled,
            },
          )}
          content={
            <DialogPrimitives.Content className="flex h-auto flex-col">
              <DialogPrimitives.Title className="sr-only">
                {t("newsletter")}
              </DialogPrimitives.Title>
              <div className="space-y-9">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Text variant="uppercase">{t("newsletter")}</Text>
                    <DialogPrimitives.Close asChild>
                      <Button>{t("close")}</Button>
                    </DialogPrimitives.Close>
                  </div>
                  <div className="space-y-10">
                    <Text>{t("sign_up_description")}</Text>
                    <InputField
                      name="firstName"
                      label=""
                      placeholder={t("first name")}
                      variant="secondary"
                      keyboardRestriction={keyboardRestrictions.nameFields}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-7">
                  <div className="space-y-7 border-b border-textInactiveColor pb-7">
                    <CheckboxField
                      name="subscribeNewArrivals"
                      label={t("new arrivals").toUpperCase()}
                      disabled={isLoading}
                      onCheckedChange={onSubscribe}
                    />
                    <CheckboxField
                      name="subscribeEvents"
                      label={t("events").toUpperCase()}
                      disabled={isLoading}
                      onCheckedChange={onSubscribe}
                    />
                  </div>
                  <div className="flex w-full flex-row justify-between lg:flex-col lg:justify-start lg:gap-3">
                    <Text variant="uppercase">{t("email preferences")}</Text>
                    <NewArrivals
                      pending={isLoading}
                      value={shoppingPreference}
                      onChange={(next) => {
                        form.setValue("shoppingPreference", next, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                  </div>
                </div>

                <Button
                  variant="main"
                  type="button"
                  size="lg"
                  className="w-full uppercase"
                  disabled={isLoading}
                  onClick={onSubscribe}
                >
                  {t("subscribe")}
                </Button>
              </div>
            </DialogPrimitives.Content>
          }
        />
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
