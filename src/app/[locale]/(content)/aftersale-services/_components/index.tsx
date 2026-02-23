"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { keyboardRestrictions } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { sendFormEvent } from "@/lib/analitycs/form";
import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/ui/form/fields/input-field";
import TextareaField from "@/components/ui/form/fields/textarea-field";
import { SubmissionToaster } from "@/components/ui/toaster";
import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";

import AftersaleSelector from "../../_components/aftersale-selector";
import { civility, options } from "../../_components/constant";
import { aftersaleForm, AftersaleSchema, defaultValues } from "./schema";

export default function AftersaleForm() {
  const t = useTranslations("aftersale-services");
  const form = useForm<AftersaleSchema>({
    resolver: zodResolver(aftersaleForm),
    defaultValues,
  });

  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  const selectedTopic = form.watch("topic");
  const subjectList = selectedTopic
    ? options[selectedTopic as keyof typeof options]
    : [];

  const formSteps = [
    {
      step: "1/4",
      title: t("topic"),
      name: "topic",
      list: Object.keys(options),
    },
    { step: "2/4", title: t("subject"), name: "subject", list: subjectList },
    { step: "3/4", title: t("civility"), name: "civility", list: civility },
  ] as const;

  const handleSubmit = async (data: AftersaleSchema) => {
    try {
      await serviceClient.SubmitSupportTicket({
        ticket: {
          ...data,
          orderReference: data.orderReference?.trim() || undefined,
          notes: data.notes?.trim() || undefined,
        },
      });

      sendFormEvent({
        email: data.email,
        formId: "aftersale-services",
      });

      setToastMessage(t("support_request_success"));
      form.reset(defaultValues);
      setOpen(true);
      setTimeout(() => router.push("/"), 2500);
    } catch (error) {
      console.error("Form submission failed:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : t("submission_error");
      setToastMessage(message);
      setOpen(true);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="mb-9 w-full space-y-9 lg:w-1/2">
            {formSteps.map(({ step, title, name, list }) => (
              <FieldsGroupContainer
                key={name}
                stage={step}
                title={title}
                collapsible={false}
              >
                <AftersaleSelector
                  control={form.control}
                  name={name}
                  list={list}
                  className="w-full lg:w-3/4"
                  renderLabel={(value) => t(value as any)}
                />
              </FieldsGroupContainer>
            ))}
            <FieldsGroupContainer
              stage="4/4"
              title={t("fill out the form")}
              collapsible={false}
            >
              <PersonalInfoForm />
            </FieldsGroupContainer>
            <Button
              type="submit"
              variant="main"
              size="lg"
              disabled={!form.formState.isValid}
              className="uppercase lg:ml-14"
            >
              {t("send")}
            </Button>
          </div>
        </form>
      </Form>
      <SubmissionToaster
        open={open}
        onOpenChange={setOpen}
        message={toastMessage}
      />
    </>
  );
}

function PersonalInfoForm() {
  const t = useTranslations("aftersale-services");
  return (
    <div className="w-full space-y-6">
      <InputField
        variant="secondary"
        name="email"
        label={t("email")}
        type="email"
      />
      <div className="flex w-full gap-3">
        <div className="w-full">
          <InputField
            variant="secondary"
            name="firstName"
            label={t("first name")}
            keyboardRestriction={keyboardRestrictions.nameFields}
          />
        </div>
        <div className="w-full">
          <InputField
            variant="secondary"
            name="lastName"
            label={t("last name")}
            keyboardRestriction={keyboardRestrictions.nameFields}
          />
        </div>
      </div>
      <InputField
        variant="secondary"
        name="orderReference"
        label={t("order reference optional")}
      />
      <TextareaField
        variant="secondary"
        name="notes"
        placeholder={t("enter notes")}
        showCharCount
        maxLength={1500}
        className="placeholder:uppercase placeholder:text-textInactiveColor"
      />
    </div>
  );
}
