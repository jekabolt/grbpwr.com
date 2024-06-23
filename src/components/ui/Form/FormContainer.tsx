import { type UseFormReturn } from "react-hook-form";

import { Form, FormFooter } from "@/components/ui/Form";
import { SubmitButton } from "@/components/forms/SubmitButton";

type Props = {
  form: UseFormReturn<any>;
  initialData: any;
  onSubmit: (data: any) => void;
  loading?: boolean;
  children: React.ReactNode;
};

export const FormContainer = ({
  form,
  initialData,
  onSubmit,
  loading,
  children,
}: Props) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {children}
        <FormFooter>
          <SubmitButton
            text={initialData ? "Save changes" : "Create"}
            disabled={loading}
          />
        </FormFooter>
      </form>
    </Form>
  );
};
