import Link from "next/link";

import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";

export const CustomParagraph = ({ children }: any) => {
  return <div className="mb-4 lg:mb-8">{children}</div>;
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
      console.log("email", email);
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

export const createMarkdownComponents = (
  onSectionChange?: (section: string) => void,
) => ({
  p: CustomParagraph,
  ul: CustomList,
  ol: CustomOrderedList,
  a: createCustomLink(onSectionChange),
});
