import { type UseFormReturn } from "react-hook-form";

import { Form, FormFooter } from "@/components/ui/form";

type Props = {
  form: UseFormReturn<any>;
  submitButton?: React.ReactNode;
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  className?: string;
  footerSide?: "left" | "right";
};

export const FormContainer = ({
  form,
  onSubmit,
  children,
  className,
  footerSide,
  submitButton,
}: Props) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
        <FormFooter side={footerSide}>{submitButton}</FormFooter>
      </form>
    </Form>
  );
};
