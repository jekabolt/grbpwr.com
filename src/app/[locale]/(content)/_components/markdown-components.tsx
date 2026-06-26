import { isValidElement, type ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";

export const CONTENT_PROSE_CLASSNAME =
  "prose-li:my-0 prose-ol:my-0 prose-ul:my-0 prose-ol:list-decimal prose-ul:list-disc prose-strong:font-normal leading-none";

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

const SUBSECTION_TITLE_MAX_LENGTH = 50;
const BLOCK_GAP = "mb-3";

function hasLowercaseLetter(text: string): boolean {
  return /\p{Ll}/u.test(text);
}

function hasUppercaseLetter(text: string): boolean {
  return /\p{Lu}/u.test(text);
}

function isSubsectionTitle(plain: string): boolean {
  if (plain.length === 0 || plain.length > SUBSECTION_TITLE_MAX_LENGTH) {
    return false;
  }
  return hasUppercaseLetter(plain) && !hasLowercaseLetter(plain);
}

const MarkdownParagraph = ({
  children,
  tierPrivileges = false,
}: {
  children?: ReactNode;
  tierPrivileges?: boolean;
}) => {
  const plain = markdownPlainText(children).trim();

  if (tierPrivileges) {
    const isDescriptionLine = plain.length === 0 || hasLowercaseLetter(plain);
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
  }

  const isTitle = isSubsectionTitle(plain);
  return (
    <div
      className={cn(
        "content-md-block leading-normal",
        BLOCK_GAP,
        isTitle && "mt-8 uppercase lg:mt-12",
      )}
    >
      {children}
    </div>
  );
};

const MarkdownList = ({ children, className, ...props }: any) => (
  <ul
    {...props}
    className={cn(
      "not-prose list-outside list-disc space-y-0 pl-5 leading-none marker:text-[inherit] [&>li]:my-0 [&_.content-md-block]:mb-0 [&_.content-md-block]:leading-none",
      BLOCK_GAP,
      className,
    )}
  >
    {children}
  </ul>
);

const MarkdownOrderedList = ({ children, className, ...props }: any) => (
  <ol
    {...props}
    className={cn(
      "not-prose list-outside list-decimal space-y-3 pl-5 leading-none marker:text-[inherit] [&_.content-md-block]:leading-none",
      BLOCK_GAP,
      className,
    )}
  >
    {children}
  </ol>
);

const MarkdownListItem = ({ children, className, ...props }: any) => (
  <li
    {...props}
    className={cn(
      "not-prose leading-none [&>ul]:mt-3 [&_.content-md-block:not(:last-child)]:mb-3 [&_.content-md-block]:mb-0 [&_.content-md-block]:leading-none",
      className,
    )}
  >
    {children}
  </li>
);

const MarkdownHeading = ({
  children,
  level,
}: {
  children?: ReactNode;
  level: 3 | 4;
}) => {
  const Tag = `h${level}` as "h3" | "h4";
  return <Tag className="mb-4 mt-8 uppercase lg:mt-12">{children}</Tag>;
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
  paragraphTone?: "tier-privileges";
};

export function createMarkdownComponents(
  onSectionChange?: (section: string) => void,
  options?: MarkdownComponentsOptions,
) {
  const tierPrivileges = options?.paragraphTone === "tier-privileges";

  return {
    p: (props: { children?: ReactNode }) => (
      <MarkdownParagraph {...props} tierPrivileges={tierPrivileges} />
    ),
    ul: MarkdownList,
    ol: MarkdownOrderedList,
    li: MarkdownListItem,
    h3: ({ children }: { children?: ReactNode }) => (
      <MarkdownHeading level={3}>{children}</MarkdownHeading>
    ),
    h4: ({ children }: { children?: ReactNode }) => (
      <MarkdownHeading level={4}>{children}</MarkdownHeading>
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <span className="font-normal">{children}</span>
    ),
    a: createCustomLink(onSectionChange),
  };
}
