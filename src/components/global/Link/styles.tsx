export enum LinkStyle {
  mainNavigation = "mainNavigation",
  bigButton = "bigButton",
  default = "default",
  notFoundCatalogButton = "notFoundCatalogButton",
}

type StyleComponentType = {
  children: React.ReactNode;
};

function DefaultStyleComponent({ children }: StyleComponentType) {
  return children;
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

function NotFoundCatalogButtonStyleComponent({ children }: StyleComponentType) {
  return (
    <span className="block w-36 bg-textColor px-1.5 text-center text-sm text-buttonTextColor">
      {children}
    </span>
  );
}

const componentsStyleMap: Record<LinkStyle, any> = {
  [LinkStyle.mainNavigation]: mainNavigationStyleComponent,
  [LinkStyle.bigButton]: BigButtonStyleComponent,
  [LinkStyle.default]: DefaultStyleComponent,
  [LinkStyle.notFoundCatalogButton]: NotFoundCatalogButtonStyleComponent,
};

export function getComponentByStyle(style: LinkStyle) {
  return componentsStyleMap[style] || DefaultStyleComponent;
}
