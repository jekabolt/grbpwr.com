"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import InputMaskedField from ".";

const meta = {
  title: "Form Fields/InputMaskedField",
  component: InputMaskedField,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "inputMasked",
    placeholder: "input masked placeholder",
    mask: "dd.mm.yyyy",
    control: {} as any,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputMaskedField>;

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
      <InputMaskedField
        control={form.control}
        label={props.label}
        name={props.name}
        mask={props.mask}
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
  description: "input masked description",
};

export const WithDescriptionAndError = FieldStoryWrapper.bind({});
// @ts-ignore
WithDescriptionAndError.args = {
  description: "input masked description",
  withError: true,
};
