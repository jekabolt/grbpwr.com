"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";
import type { AccountSchema } from "@/app/[locale]/account/utils/schema";
import { EMAIL_REFERENCE_STEPS } from "@/app/[locale]/account/utils/utility";

import { EmailPreferenceStepRow } from "../_components/email-steps";
import { NewArrivals } from "../_components/new-arrivals";
import { UserLocation } from "../_components/user-location";
import { useEmailPreferences } from "../utils/use-email-preferences";

export function EmailPreferences() {
  const { pending, scheduleSave, toastOpen, toastMessage, setToastOpen } =
    useEmailPreferences();
  const form = useFormContext<AccountSchema>();
  const shoppingPreference = useWatch({
    control: form.control,
    name: "shoppingPreference",
  });

  return (
    <>
      <div className="flex w-full flex-col gap-8">
        <Text variant="uppercase" className="hidden lg:block">
          email preferences
        </Text>
        <div className="flex flex-col lg:gap-10">
          {EMAIL_REFERENCE_STEPS.map((step) => (
            <EmailPreferenceStepRow
              key={step.name}
              step={step}
              disabled={pending}
              onCommitted={scheduleSave}
            />
          ))}
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex w-full flex-row justify-between lg:flex-col lg:justify-start lg:gap-6">
            <Text variant="uppercase">email preferences</Text>
            <NewArrivals
              pending={pending}
              value={shoppingPreference}
              onChange={(next) => {
                form.setValue("shoppingPreference", next, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                scheduleSave();
              }}
            />
          </div>
          <div className="hidden lg:block">
            <UserLocation pending={pending} />
          </div>
        </div>
      </div>
      <SubmissionToaster
        open={toastOpen}
        message={toastMessage}
        onOpenChange={setToastOpen}
      />
    </>
  );
}
