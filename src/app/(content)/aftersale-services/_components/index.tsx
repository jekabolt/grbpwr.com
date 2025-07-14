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

import AftersaleSelector from "./aftersale-selector";
import { civility, options } from "./constant";
import FormSection from "./form-section";
import { aftersaleForm, AftersaleSchema, defaultValues } from "./schema";

export default function AftersaleForm() {
  const form = useForm<AftersaleSchema>({
    resolver: zodResolver(aftersaleForm),
    defaultValues,
  });

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const topicList = Object.keys(options);
  const selectedTopic = form.watch("topic");
  const subjectList = selectedTopic
    ? options[selectedTopic as keyof typeof options]
    : [];

  const formSteps = [
    { step: "1/4", title: "topic", name: "topic", list: topicList },
    {
      step: "2/4",
      title: "subject",
      name: "subject",
      list: subjectList,
    },
    {
      step: "3/4",
      title: "civility",
      name: "civility",
      list: civility,
    },
  ] as const;

  async function handleSubmit(data: AftersaleSchema) {
    try {
      const response = await serviceClient.SubmitSupportTicket({
        ticket: {
          ...data,
          orderReference: data.orderReference || "",
          notes: data.notes || "",
        },
      });
      if (response) {
        setOpen(true);
        setTimeout(() => {
          form.reset(defaultValues);
          router.push("/success");
        }, 2100);
      }
      console.log("form submitted");
    } catch (error) {
      console.log("form can't be submitted", form.formState.errors);
      console.error(error);
    }
  }

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
                  className="w-full lg:w-3/4 lg:pl-14"
                />
              </FormSection>
            ))}
            <FormSection step="4/4" title="fill out the form">
              <div className="w-full space-y-6 lg:pl-14">
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
