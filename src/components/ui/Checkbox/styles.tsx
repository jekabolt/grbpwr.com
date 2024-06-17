export enum CheckboxStyle {
  default = "default",
}

const inputComponentsStyleMap: Record<CheckboxStyle, string> = {
  [CheckboxStyle.default]:
    "flex h-[12px] w-[12px] appearance-none items-center justify-center border border-black",
};

export function getComponentByStyle(style: CheckboxStyle) {
  return inputComponentsStyleMap[style] || "";
}
