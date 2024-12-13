import { FormProvider as Form, UseFormReturn } from "react-hook-form";

import { Button } from "../button";
import { CopyIcon } from "../icons/copy-icon";

interface Props {
  form?: UseFormReturn<any>;
  children: React.ReactNode;
  copyButton: React.ReactNode;
  className?: string;
  onCopy: () => void;
}

export const CopyFormContainer = ({
  form,
  children,
  copyButton,
  className,
  onCopy,
}: Props) => {
  return (
    <Form {...form!}>
      <form className={className}>{children}</form>

      <div className="flex justify-end sm:mt-8 sm:justify-center">
        <Button
          type="button"
          variant="underline"
          className="flex items-center gap-1 uppercase sm:gap-3"
          onClick={onCopy}
        >
          {copyButton}
          <CopyIcon className="text-textColor" />
        </Button>
      </div>
    </Form>
  );
};
