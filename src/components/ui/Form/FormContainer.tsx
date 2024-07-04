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
};

export const FormContainer = ({
  form,
  initialData,
  onSubmit,
  loading,
  children,
  className,
}: Props) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
        <FormFooter>
          <SubmitButton
            text="submit"
            // text={initialData ? "Save changes" : "create"}
            disabled={loading}
          />
        </FormFooter>
      </form>
    </Form>
  );
};
