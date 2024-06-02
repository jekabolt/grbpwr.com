import Link from "next/link";
import { getComponentByStyle, LinkStyle } from "./styles";
import React from "react";

export default function GlobalLink({
  style = LinkStyle.default,
  href,
  children,
}: {
  style?: LinkStyle;
  href: string;
  children?: React.ReactNode;
}) {
  const Component = getComponentByStyle(style);

  return (
    <div>
      <Link href={href}>
        <Component>{children}</Component>
      </Link>
    </div>
  );
}
