export type LinkStyle = "navigationLink";

function NavigationLinkStyleComponent({ children }: any) {
  return (
    <span className="text-sm text-highlightTextColor underline">
      {children}
    </span>
  );
}

function DefaultStyleComponent({ children }: any) {
  return <span>232323</span>;
}

const componentsStyleMap: Record<LinkStyle, any> = {
  navigationLink: NavigationLinkStyleComponent,
};

export function getComponentByStyle(style: LinkStyle) {
  return componentsStyleMap[style] || DefaultStyleComponent;
}
