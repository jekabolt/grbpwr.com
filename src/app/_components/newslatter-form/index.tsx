"use client";

import { useState } from "react";

import { serviceClient } from "@/lib/api";
import { cn, validateEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CheckboxGlobal from "@/components/ui/checkbox";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function NewslatterForm({
  view = "checkout",
}: {
  view?: "footer" | "checkout";
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isValidEmail = validateEmail(email);

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
    <form onSubmit={handleSubmit}>
      {view === "checkout" ? (
        <>
          <Text variant="uppercase" className="mb-7">
            newsletter
          </Text>
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end">
            <div className="w-full">
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
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="relative flex items-center justify-between border border-textColor px-4 py-3">
            <Input
              id="newsletter"
              placeholder="MAILING LIST"
              name="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              disabled={isLoading}
              className="w-full grow border-none text-textBaseSize leading-4 placeholder:text-textColor"
            />
            <Button
              className={cn("flex-none uppercase text-textInactiveColor", {
                "text-textColor": isValidEmail && !isLoading,
              })}
              type="submit"
              disabled={isLoading || !isValidEmail}
            >
              apply
            </Button>
          </div>
          {isValidEmail && (
            <CheckboxGlobal
              name="newsLetter"
              label="i agree to recieve emails. read our privacy policy for more information."
            />
          )}
        </div>
      )}
    </form>
  );
}
