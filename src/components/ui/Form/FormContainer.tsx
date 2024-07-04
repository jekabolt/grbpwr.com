import { type UseFormReturn } from "react-hook-form";

import { Form, FormFooter } from "@/components/ui/Form";
import { SubmitButton } from "@/components/forms/SubmitButton";

type Props = {
  form: UseFormReturn<any>;
  initialData: any;
  onSubmit: (data: any) => void;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  ctaLabel: string;
  footerSide?: "left" | "right";
};

export const FormContainer = ({
  form,
  initialData,
  onSubmit,
  loading,
  children,
  className,
  ctaLabel,
  footerSide,
}: Props) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
        <FormFooter side={footerSide}>
          <SubmitButton
            text={ctaLabel}
            // text={initialData ? "Save changes" : "create"}
            disabled={loading}
          />
        </FormFooter>
      </form>
    </Form>
  );
};
