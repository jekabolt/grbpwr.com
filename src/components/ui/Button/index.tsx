import { Slot } from "@radix-ui/react-slot";
import { getComponentByStyle, ButtonStyle } from "./styles";

export default function Button({
  style = ButtonStyle.default,
  asChild,
  children,
  ...props
}: {
  style?: ButtonStyle;
  asChild?: boolean;
  children: React.ReactNode;
  [k: string]: unknown;
}) {
  const Component = asChild ? Slot : "button";
  const ComponentStyle = getComponentByStyle(style);

  return (
    <div>
      <Component {...props}>
        <ComponentStyle>{children}</ComponentStyle>
      </Component>
    </div>
  );
}
