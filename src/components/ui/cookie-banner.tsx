"use client";

import { useEffect, useState } from "react";

import { Text } from "@/components/ui/text";

import { Button } from "./button";
import RadioGroupComponent from "./radio-group";

const cookieOptions = [
  { label: "accept all", value: "accept" },
  { label: "deny all", value: "deny" },
];

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<"accept" | "deny" | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleConsent = (value: string) => {
    setConsent(value as "accept" | "deny");
  };

  const handleSubmit = () => {
    if (consent === "accept") {
      localStorage.setItem("cookieConsent", "true");
    } else {
      localStorage.setItem("cookieConsent", "false");
    }
    setIsVisible(false);
  };

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
      <RadioGroupComponent
        name="cookieConsent"
        items={cookieOptions}
        onValueChange={handleConsent}
        value={consent ?? undefined}
        className="grid max-w-xs grid-cols-2"
      />
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
