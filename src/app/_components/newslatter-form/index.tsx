import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";

import { formSubmitClick } from "./todo-schema";

export default function NewslatterForm({
  view = "checkout",
}: {
  view?: "footer" | "checkout";
}) {
  return (
    <form action={formSubmitClick}>
      {view === "checkout" ? (
        <CheckoutNewslatterForm />
      ) : (
        <FooterNewslatterForm />
      )}
    </form>
  );
}

function CheckoutNewslatterForm() {
  return (
    <>
      <Text variant="uppercase" className="mb-7">
        newsletter
      </Text>
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end">
        <Input
          id="newsletter"
          type="email"
          required
          placeholder="email"
          name="email"
        />
        <Button
          variant="main"
          size="lg"
          type="submit"
          className="!bg-bgColor uppercase text-textColor"
        >
          subscribe
        </Button>
      </div>
    </>
  );
}

function FooterNewslatterForm() {
  return (
    <div className="relative flex items-center justify-between border border-textInactiveColor px-4 py-3">
      <Input
        id="newsletter"
        placeholder="MAILING LIST"
        name="email"
        type="email"
        className="w-full grow border-none text-textBaseSize leading-4"
      />
      <Button className="flex-none uppercase" type="submit">
        apply
      </Button>
    </div>
  );
}
