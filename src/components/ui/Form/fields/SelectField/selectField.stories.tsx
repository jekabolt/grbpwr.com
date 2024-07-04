"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import SelectField from ".";

const meta = {
  title: "Form Fields/SelectField",
  component: SelectField,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "select label",
    name: "select",
    placeholder: "select placeholder",
    items: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
      { label: "Option 3", value: "3" },
    ],
    control: {} as any,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SelectField>;

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
      <SelectField
        control={form.control}
        label={props.label}
        name={props.name}
        items={props.items}
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
