"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import RadioGroupField from ".";

const meta = {
  title: "Form Fields/RadioGroupField",
  component: RadioGroupField,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "radioGroup",
    items: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
      { label: "Option 3", value: "3" },
      { label: "Option 4", value: "4" },
      { label: "Option 5", value: "5" },
    ],
    control: {} as any,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroupField>;

export default meta;
type Story = StoryObj<typeof meta>;

function FieldStoryWrapper(props: any) {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        [props.name]: z.string().refine(Boolean),
      }),
    ),
    // errors: {
    //   [props.name]: { type: "custom", message: "custom message" },
    // },
  });

  // todo: remove effect and set error bu default ☝️
  useEffect(() => {
    if (props.withError) {
      form.setError(props.name, {
        type: "custom",
        message: "Error message for the field",
      });
    }
  }, []);

  return (
    <FormProvider {...form}>
      <RadioGroupField
        items={props.items}
        control={form.control}
        label={props.label}
        name={props.name}
        description={props.description}
      />
    </FormProvider>
  );
}

export const Default = FieldStoryWrapper.bind({});
// @ts-ignore
Default.args = {};

export const WithError = FieldStoryWrapper.bind({});
// @ts-ignore
WithError.args = {
  withError: true,
};

export const WithDescription = FieldStoryWrapper.bind({});
// @ts-ignore
WithDescription.args = {
  description: "radio group description",
};

export const WithDescriptionAndError = FieldStoryWrapper.bind({});
// @ts-ignore
WithDescriptionAndError.args = {
  description: "radio group description",
  withError: true,
};
