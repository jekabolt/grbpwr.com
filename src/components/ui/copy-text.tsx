"use client";

import { useState } from "react";
import Image from "next/image";

import { Text } from "@/components/ui/text";

import { Button } from "./button";
import copied from "./copy-images/checkmark-circle-outline-svgrepo-com.svg";
import copy from "./copy-images/copy-icon.svg";

interface Props {
  text: string;
}

export default function CopyText({ text }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (e) {
      console.error("failed to copy text", e);
    }
  };
  return (
    <div className="flex h-4 items-center gap-1">
      <Text size="small" variant="inactive">
        {text}
      </Text>
      <Button size="sm" onClick={handleCopy} asChild>
        {isCopied ? (
          <Image src={copied} alt="copied" width={15} height={15} />
        ) : (
          <Image src={copy} alt="copy" width={15} height={15} />
        )}
      </Button>
    </div>
  );
}
