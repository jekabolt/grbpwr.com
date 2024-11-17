"use client";

import { useEffect, useState } from "react";

import { Text } from "@/components/ui/text";

import { Button } from "./button";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<"accept" | "deny" | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (e: any) => {
    setConsent(e.target.value as "accept" | "deny");
  };

  const handleSubmit = () => {
    if (consent === "accept") {
      localStorage.setItem("cookieConsent", "true");
    } else {
      localStorage.setItem("cookieConsent", "false");
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 space-y-6 bg-white p-4">
      <div>
        <Text variant="uppercase">managing your data preferences</Text>
      </div>
      <div>
        <Text>
          you can manage your preferences regarding your data trough our website
        </Text>
      </div>
      <div className="grid max-w-xs grid-cols-2 gap-0">
        <div className="flex items-center gap-1">
          <input
            type="radio"
            id="accept"
            value="accept"
            onChange={handleConsent}
            name="cookieConsent"
            className="h-3 w-3 appearance-none rounded-full border border-black  checked:border-black checked:bg-black checked:hover:border-black checked:hover:bg-black focus:outline-none focus:ring-black"
          />
          <Text htmlFor="accept" component="label">
            accept all
          </Text>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="radio"
            id="deny"
            value="deny"
            onChange={handleConsent}
            name="cookieConsent"
            className="h-3 w-3 appearance-none rounded-full border border-black  checked:border-black checked:bg-black checked:hover:border-black checked:hover:bg-black focus:outline-none focus:ring-black"
          />
          <Text htmlFor="deny" component="label">
            deny all
          </Text>
        </div>
      </div>
      <div>
        <Button
          variant="main"
          size="lg"
          className="uppercase"
          onClick={handleSubmit}
        >
          submit
        </Button>
      </div>
    </div>
  );
}
