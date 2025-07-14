"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { keyboardRestrictions } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/ui/form/fields/input-field";
import TextareaField from "@/components/ui/form/fields/textarea-field";
import { SubmissionToaster } from "@/components/ui/toaster";

import AftersaleSelector from "../../_components/aftersale-selector";
import { civility, options } from "../../_components/constant";
import FormSection from "../../_components/form-section";
import { aftersaleForm, AftersaleSchema, defaultValues } from "./schema";

export default function AftersaleForm() {
  const form = useForm<AftersaleSchema>({
    resolver: zodResolver(aftersaleForm),
    defaultValues,
  });

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const selectedTopic = form.watch("topic");
  const subjectList = selectedTopic
    ? options[selectedTopic as keyof typeof options]
    : [];

  const formSteps = [
    { step: "1/4", title: "topic", name: "topic", list: Object.keys(options) },
    { step: "2/4", title: "subject", name: "subject", list: subjectList },
    { step: "3/4", title: "civility", name: "civility", list: civility },
  ] as const;

  const handleSubmit = async (data: AftersaleSchema) => {
    try {
      await serviceClient.SubmitSupportTicket({
        ticket: {
          ...data,
          orderReference: data.orderReference || "",
          notes: data.notes || "",
        },
      });

      setOpen(true);
      setTimeout(() => {
        form.reset(defaultValues);
        router.push("/success");
      }, 2100);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="mb-9 w-full space-y-9 lg:w-1/2">
            {formSteps.map(({ step, title, name, list }) => (
              <FormSection key={name} step={step} title={title}>
                <AftersaleSelector
                  control={form.control}
                  name={name}
                  list={list}
                  className="w-full lg:w-3/4"
                />
              </FormSection>
            ))}

            <FormSection step="4/4" title="fill out the form">
              <PersonalInfoForm />
            </FormSection>

            <Button
              type="submit"
              variant="main"
              size="lg"
              disabled={!form.formState.isValid}
              className="uppercase lg:ml-14"
            >
              send
            </Button>
          </div>
        </form>
      </Form>

      <SubmissionToaster
        open={open}
        onOpenChange={setOpen}
        title="success"
        message="form submitted successfully"
      />
    </>
  );
}

function PersonalInfoForm() {
  return (
    <div className="w-full space-y-6">
      <InputField
        variant="secondary"
        name="email"
        label="EMAIL*"
        type="email"
      />
      <div className="flex w-full gap-3">
        <div className="w-full">
          <InputField
            variant="secondary"
            name="firstName"
            label="FIRST NAME*"
            keyboardRestriction={keyboardRestrictions.nameFields}
          />
        </div>
        <div className="w-full">
          <InputField
            variant="secondary"
            name="lastName"
            label="LAST NAME*"
            keyboardRestriction={keyboardRestrictions.nameFields}
          />
        </div>
      </div>
      <InputField
        variant="secondary"
        name="orderReference"
        label="ORDER REFERENCE"
      />
      <TextareaField
        variant="secondary"
        name="notes"
        placeholder="ENTER NOTES"
        showCharCount
        maxLength={1500}
        className="placeholder:text-textColor"
      />
    </div>
  );
}
