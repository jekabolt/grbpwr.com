export enum ButtonStyle {
  default = "default",
  bigButton = "bigButton",
  underlinedButton = "underlinedButton",
  underlinedHightlightButton = "underlinedHightlightButton",
  simpleButton = "simpleButton",
}

type StyleComponentType = {
  children: React.ReactNode;
};

function DefaultStyleComponent({ children }: StyleComponentType) {
  return children;
}

function UnderlinedButtonStyleComponent({ children }: StyleComponentType) {
  return (
    <span className="cursor-pointer text-sm text-textColor underline">
      {children}
    </span>
  );
}

function UnderlinedHightlightButtonStyleComponent({
  children,
}: StyleComponentType) {
  return (
    <span className="text-sm text-highlightTextColor underline">
      {children}
    </span>
  );
}

function BigButtonStyleComponent({ children }: StyleComponentType) {
  return (
    <span className="block w-full border-8 border-textColor bg-textColor p-2 text-7xl text-buttonTextColor transition-all hover:bg-buttonTextColor hover:text-textColor lg:px-5 lg:py-6 lg:text-[164px]">
      {children}
    </span>
  );
}

function SimpleButtonStyleComponent({ children }: StyleComponentType) {
  return (
    <span className="block w-48 cursor-pointer bg-textColor py-2 text-center leading-3 text-bgColor lg:text-lg lg:leading-5">
      {children}
    </span>
  );
}

const componentsStyleMap: Record<ButtonStyle, any> = {
  [ButtonStyle.underlinedButton]: UnderlinedButtonStyleComponent,
  [ButtonStyle.underlinedHightlightButton]:
    UnderlinedHightlightButtonStyleComponent,
  [ButtonStyle.bigButton]: BigButtonStyleComponent,
  [ButtonStyle.default]: DefaultStyleComponent,
  [ButtonStyle.simpleButton]: SimpleButtonStyleComponent,
};

export function getComponentByStyle(style: ButtonStyle) {
  return componentsStyleMap[style] || DefaultStyleComponent;
}
