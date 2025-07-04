"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Toaster } from "@/components/ui/toaster";

import { Button } from "./button";
import { CopyCheckIcon } from "./icons/copy-check-icon";
import { CopyIcon } from "./icons/copy-icon";

interface Props {
  text: string;
  displayText?: string;
  cutText?: number;
  variant?: "underlined" | "undrleineWithColors";
  mode?: "toaster" | "default";
}

export default function CopyText({
  text,
  displayText,
  cutText,
  mode = "default",
  variant = "undrleineWithColors",
}: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      if (mode === "default" || mode === "toaster") {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      }
    } catch (e) {
      console.error("failed to copy text", e);
    }
  };

  const getDisplayText = () => {
    if (displayText) return displayText;

    if (cutText) return `${text.slice(0, cutText)}...`;

    return text;
  };

  const textElement = (
    <Text
      size="small"
      variant={variant}
      onClick={handleCopy}
      className={cn("text cursor-pointer", {
        "text-visitedLinkColor": mode === "toaster" && isCopied,
      })}
    >
      {getDisplayText()}
    </Text>
  );

  return (
    <div className="flex h-4 items-center gap-1">
      {mode === "toaster" ? (
        <Toaster title="email">{textElement}</Toaster>
      ) : (
        <>
          {textElement}
          <Button size="sm" onClick={handleCopy} asChild>
            {isCopied ? (
              <CopyCheckIcon className="text-textColor" />
            ) : (
              <CopyIcon className="text-textColor" />
            )}
          </Button>
        </>
      )}
    </div>
  );
}
