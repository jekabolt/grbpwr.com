import Link from "next/link";
import { getComponentByStyle, LinkStyle } from "./styles";

export default function GlobalLink({
  style = LinkStyle.default,
  href,
  title,
}: {
  style?: LinkStyle;
  href: string;
  title?: string;
}) {
  const Component = getComponentByStyle(style);

  return (
    <div>
      <Link href={href}>
        <Component>{title}</Component>
      </Link>
    </div>
  );
}
