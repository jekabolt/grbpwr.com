import Link from "next/link";

import { Button } from "@/components/ui/button";
import CopyText from "@/components/ui/copy-text";

export const CustomParagraph = ({ children }: any) => {
  return <div className="mb-4 lg:mb-8">{children}</div>;
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
          displayText={children}
          variant="undrleineWithColors"
          mode="toaster"
          className="inline-flex cursor-pointer"
        />
      );
    }
    if (!href) return <span>{children}</span>;

    return (
      <Button variant="underlineWithColors" asChild>
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
  a: createCustomLink(onSectionChange),
});
