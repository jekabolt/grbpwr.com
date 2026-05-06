import { isValidElement } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";

export const CustomParagraph = ({ children }: any) => {
  return <div className="mb-4 lg:mb-8">{children}</div>;
};

function markdownPlainText(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(markdownPlainText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: unknown };
    if (props.children != null) return markdownPlainText(props.children);
  }
  return "";
}

export const TierPrivilegeParagraph = ({ children }: any) => {
  const plain = markdownPlainText(children).trim();
  const hasLowercaseLetter = /\p{Ll}/u.test(plain);
  const isDescriptionLine = plain.length === 0 || hasLowercaseLetter;

  return (
    <div
      className={cn(
        "mb-4 lg:mb-8",
        isDescriptionLine ? "lowercase" : "uppercase",
      )}
    >
      {children}
    </div>
  );
};

export const CustomList = ({ children, ...props }: any) => {
  return (
    <ul {...props} className="mb-4 lg:mb-8">
      {children}
    </ul>
  );
};

export const CustomOrderedList = ({ children, ...props }: any) => {
  return (
    <ol {...props} className="mb-4 lg:mb-8">
      {children}
    </ol>
  );
};

export const CustomListItem = ({ children, ...props }: any) => {
  return <li {...props}>{children}</li>;
};

export const createCustomLink = (
  onSectionChange?: (section: string) => void,
) => {
  const CustomLink = (props: any) => {
    const { href, children } = props;
    if (href?.includes("section=cookies")) {
      return (
        <Button
          variant="underlineWithColors"
          className="inline cursor-pointer"
          onClick={() => onSectionChange?.("cookies")}
        >
          {children}
        </Button>
      );
    }
    if (href?.startsWith("mailto:")) {
      const email = href.replace("mailto:", "");
      return (
        <CopyText
          text={email}
          displayText={email}
          variant="undrleineWithColors"
          mode="toaster"
          className="inline-flex cursor-pointer"
        />
      );
    }
    if (!href) return <span>{children}</span>;

    return (
      <Button variant="underlineWithColors" className="inline" asChild>
        <Link href={href}>{children}</Link>
      </Button>
    );
  };

  CustomLink.displayName = "CustomLink";
  return CustomLink;
};

export type MarkdownComponentsOptions = {
  /** Tier privilege MD: alternate ALL-CAPS titles with lowercase descriptive lines without forcing one casing on everything. */
  paragraphTone?: "default" | "tier-privileges";
};

export function createMarkdownComponents(
  onSectionChange?: (section: string) => void,
  options?: MarkdownComponentsOptions,
) {
  const P =
    options?.paragraphTone === "tier-privileges"
      ? TierPrivilegeParagraph
      : CustomParagraph;

  return {
    p: P,
    ul: CustomList,
    ol: CustomOrderedList,
    li: CustomListItem,
    a: createCustomLink(onSectionChange),
  };
}
