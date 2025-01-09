"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";

interface Props {
  footer?: boolean;
}

export default function NewslatterForm({ footer }: Props) {
  const handleSubmit = async (values: any) => {
    console.log(new FormData(values));
    // try {
    //   await serviceClient.SubscribeNewsletter({
    //     email: formData.get("email") as string,
    //   });
    // } catch (error) {}
  };

  return (
    <form action={handleSubmit}>
      <Text variant="uppercase" className="mb-6">
        newsletter
      </Text>
      <label htmlFor="newsletter" className="mb-3 block">
        <Text size="small">{footer ? "e-mail adress" : "email"}</Text>
      </label>
      <div
        className={cn("flex items-center gap-4", {
          "flex-col items-start gap-6": footer,
        })}
      >
        <Input
          id="newsletter"
          type="email"
          required
          placeholder="email"
          name="email"
        />
        <Button
          variant={footer ? "main" : "simple"}
          size={footer ? "lg" : "sm"}
          type="submit"
          className={cn({
            "border border-white uppercase": footer,
          })}
        >
          subscribe
        </Button>
      </div>
    </form>
  );
}
