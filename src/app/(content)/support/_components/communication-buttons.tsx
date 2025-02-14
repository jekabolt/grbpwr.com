"use client";

import { Button } from "@/components/ui/button";

export function CommunicationButtons() {
  function handleCopyEmail() {
    navigator.clipboard.writeText("info@gibpwr.com");
  }

  return (
    <div className="flex gap-4 ">
      <Button asChild variant="main" size="lg">
        <a href="https://t.me" target="_blank" rel="noopener noreferrer">
          TELEGRAM BOT
        </a>
      </Button>
      <Button variant="main" size="lg" onClick={handleCopyEmail}>
        COPY EMAIL
      </Button>
    </div>
  );
}
