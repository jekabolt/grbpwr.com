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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      await serviceClient.SubscribeNewsletter({ email });
      setEmail("");
      console.log("Successfully subscribed to newsletter");
    } catch (error) {
      console.error("Failed to subscribe to newsletter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Text variant="uppercase" className="mb-7">
        mailing list
      </Text>
      <div className="flex w-full flex-col items-start gap-6">
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
        />
      </div>
      <Button
        variant="secondary"
        size="lg"
        type="submit"
        disabled={isLoading || !email}
        className="uppercase"
      >
        subscribe
      </Button>
    </form>
  );
}
