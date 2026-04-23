import { useFormContext } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";
import { AccountPersonalInfoFields } from "@/app/[locale]/account/_components/personal-info-fields";
import type { AccountSchema } from "@/app/[locale]/account/utils/schema";
import { useAccountUpdate } from "@/app/[locale]/account/utils/use-account-update";

export function PersonalInfo({
  selectedCountryCode,
}: {
  selectedCountryCode: string;
}) {
  const form = useFormContext<AccountSchema>();
  const { pending, toastOpen, toastMessage, setToastOpen, updateAccount } =
    useAccountUpdate();
  const { currentCountry, languageId } = useTranslationsStore((s) => s);

  async function onSubmit(data: AccountSchema) {
    await updateAccount({
      data,
      context: {
        languageId,
        currentCountryCode: currentCountry.countryCode,
      },
      mode: "personal",
    });
  }
  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-14"
      >
        <Text variant="uppercase">personal info</Text>
        <AccountPersonalInfoFields
          twoColumn
          disabled={pending}
          selectedCountryCode={selectedCountryCode}
        />
        <Button
          type="submit"
          variant="main"
          size="lg"
          className="uppercase"
          loading={pending}
          disabled={pending}
        >
          save changes
        </Button>
      </form>
      <SubmissionToaster
        open={toastOpen}
        message={toastMessage}
        onOpenChange={setToastOpen}
      />
    </>
  );
}
