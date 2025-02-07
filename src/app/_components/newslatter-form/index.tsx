import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";

import { formSubmitClick } from "./todo-schema";

export default function NewslatterForm() {
  return (
    <form action={formSubmitClick}>
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
    </form>
  );
}
