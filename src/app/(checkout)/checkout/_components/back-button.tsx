"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();

  function handleClick() {
    // if (window.history.length <= 1) {
    //   router.push("/support");
    // } else {
    //   router.back();
    // }
    router.push("/cart");
  }

  return (
    <Button
      variant="underlineWithColors"
      className={cn("w-16", className)}
      onClick={handleClick}
      size="sm"
    >
      {"<"}
      <span className="hidden lg:inline"> back</span>
    </Button>
  );
}
