"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { serviceClient } from "@/lib/api";
import { validateEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CheckboxGlobal from "@/components/ui/checkbox";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

export default function NewslatterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const t = useTranslations("newslatter");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setToastMessage("Please enter a valid email address");
      setToastOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      await serviceClient.SubscribeNewsletter({ email });
      setEmail("");
      setIsChecked(false);
      setToastMessage("successfully subscribed to newsletter!");
      setToastOpen(true);
    } catch (error) {
      console.error("Failed to subscribe to newsletter:", error);
      setToastMessage("failed to subscribe. please try again.");
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Text variant="uppercase" className="leading-none">
          {t("mailing list")}
        </Text>
        <div className="flex w-full flex-col items-start gap-3">
          <Input
            id="newsletter"
            type="email"
            required
            placeholder={t("email")}
            name="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            disabled={isLoading}
          />
          <CheckboxGlobal
            name="newsLetter"
            label={t("agree")}
            checked={isChecked}
            onCheckedChange={(checked: boolean) => setIsChecked(checked)}
          />
        </div>
        <Button
          variant="simple"
          size="lg"
          type="submit"
          disabled={isLoading || !email || !isChecked}
          className="border uppercase disabled:border-textColor disabled:bg-bgColor disabled:text-textColor"
        >
          {t("subscribe")}
        </Button>
      </form>
      <SubmissionToaster
        open={toastOpen}
        onOpenChange={setToastOpen}
        message={toastMessage}
      />
    </>
  );
}
