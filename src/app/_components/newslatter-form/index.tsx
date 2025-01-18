import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";

import { formSubmitClick } from "./todo-schema";

export default function NewslatterForm() {
  return (
    <form action={formSubmitClick}>
      <Text variant="uppercase" className="mb-6">
        newsletter
      </Text>
      <label htmlFor="newsletter" className="mb-3 block">
        <Text size="small">e-mail adress</Text>
      </label>
      <div className="flex flex-col items-start gap-6">
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
          className="bg-textColor uppercase text-bgColor"
        >
          subscribe
        </Button>
      </div>
    </form>
  );
}
