"use client";

import { useState } from "react";

import { serviceClient } from "@/lib/api";
import { validateEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CheckboxGlobal from "@/components/ui/checkbox";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function NewslatterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      await serviceClient.SubscribeNewsletter({ email });
      setEmail("");
      setIsChecked(false);
      console.log("Successfully subscribed to newsletter");
    } catch (error) {
      console.error("Failed to subscribe to newsletter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Text variant="uppercase" className="leading-none">
        mailing list
      </Text>
      <div className="flex w-full flex-col items-start gap-3">
        <Input
          id="newsletter"
          type="email"
          required
          placeholder="email"
          name="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          disabled={isLoading}
        />
        <CheckboxGlobal
          name="newsLetter"
          label="i agree to recieve emails. read our privacy policy for more information."
          checked={isChecked}
          onCheckedChange={(checked: boolean) => setIsChecked(checked)}
        />
      </div>
      <Button
        variant="simple"
        size="lg"
        type="submit"
        disabled={isLoading || !email || !isChecked}
        className="border uppercase disabled:border-textColor disabled:bg-bgColor disabled:text-textColor"
      >
        subscribe
      </Button>
    </form>
  );
}
