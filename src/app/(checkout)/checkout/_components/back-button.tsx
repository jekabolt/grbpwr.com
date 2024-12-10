"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  function handleClick() {
    router.back();

    if (window.history.length <= 1) {
      router.push("/cart");
    }
  }

  return (
    <Button
      variant="underlineWithColors"
      className="w-16"
      onClick={handleClick}
    >
      {"<"} back
    </Button>
  );
}
