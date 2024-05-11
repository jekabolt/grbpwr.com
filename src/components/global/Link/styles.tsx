export type LinkStyle = "mainNavigation" | "bigButton";

type StyleComponentType = {
  children: React.ReactNode;
};

function DefaultStyleComponent({ children }: StyleComponentType) {
  return <span>{children}</span>;
}

function mainNavigationStyleComponent({ children }: StyleComponentType) {
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

const componentsStyleMap: Record<LinkStyle, any> = {
  mainNavigation: mainNavigationStyleComponent,
  bigButton: BigButtonStyleComponent,
};

export function getComponentByStyle(style: LinkStyle) {
  return componentsStyleMap[style] || DefaultStyleComponent;
}
