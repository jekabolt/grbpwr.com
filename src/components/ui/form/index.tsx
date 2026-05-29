"use client";

import { createContext, useContext, useId } from "react";
import { Label } from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { resolveErrorTranslationKey } from "@/components/ui/form/utils/resolve-error-translation-key";

import { Text } from "../text";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem({ className, ref, ...props }: any) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

FormItem.displayName = "FormItem";

function FormLabel({ className, ref, ...props }: any) {
  const { formItemId } = useFormField();

  return (
    <Label ref={ref} className={cn(className)} htmlFor={formItemId} {...props}>
      <Text component="span" size="small">
        {props.children}
      </Text>
    </Label>
  );
}

FormLabel.displayName = "FormLabel";

function FormControl(props: any) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

FormControl.displayName = "FormControl";

function FormDescription({ className, ref, ...props }: any) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  );
}

FormDescription.displayName = "FormDescription";

function FormMessage({
  className,
  children,
  ref,
  translateError,
  fieldName,
  gate,
  ...props
}: any) {
  const { error, formMessageId, isTouched } = useFormField();
  const { formState } = useFormContext();
  if (gate === false) {
    return null;
  }

  const submitAttempted =
    formState.isSubmitted || (formState.submitCount ?? 0) > 0;
  const shouldShowError = !!error && (!!isTouched || submitAttempted);
  let body;

  if (!shouldShowError && !children) return null;

  if (shouldShowError && translateError && fieldName) {
    const errorMessage = String(error.message || "");
    const baseFieldName = fieldName.includes(".")
      ? fieldName.split(".").pop() || fieldName
      : fieldName;
    const errorType = resolveErrorTranslationKey(error);

    if (errorType) {
      const errorKey = `${baseFieldName}.${errorType}`;
      const translated = translateError(errorKey);
      const translationMissing =
        translated === errorKey ||
        translated === `errors.${errorKey}` ||
        translated.startsWith(`errors.${errorKey}.`);
      body = translationMissing ? errorMessage : translated;
    } else {
      body = errorMessage;
    }
  } else {
    body = shouldShowError ? String(error?.message) : children;
  }

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-xs lowercase", className, {
        "text-errorColor": shouldShowError,
      })}
      {...props}
    >
      {body}
    </p>
  );
}

FormMessage.displayName = "FormMessage";

type FormFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: "left" | "right";
};

const FormFooter = ({
  className,
  side = "left",
  ...props
}: FormFooterProps) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      {
        "sm:justify-end": side === "right",
        "sm:justify-start": side === "left",
      },
      className,
    )}
    {...props}
  />
);

FormFooter.displayName = "FormFooter";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormFooter,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
