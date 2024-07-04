"use client";

import type { Meta, StoryObj } from "@storybook/react";
import CheckboxField from ".";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

const meta = {
  title: "Form Fields/CheckboxField",
  component: CheckboxField,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "checkbox label",
    name: "checkbox",
    control: {} as any,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

function FieldStoryWrapper(props: any) {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        [props.name]: z.boolean().refine(Boolean),
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
      <CheckboxField
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

export const WithDescription = FieldStoryWrapper.bind({});
// @ts-ignore
WithDescription.args = {
  description: "checkbox description",
};

export const WithError = FieldStoryWrapper.bind({});
// @ts-ignore
WithError.args = {
  withError: true,
};

export const WithDescriptionAndError = FieldStoryWrapper.bind({});
// @ts-ignore
WithDescriptionAndError.args = {
  description: "checkbox description",
  withError: true,
};
