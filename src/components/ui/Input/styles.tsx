export enum InputStyle {
  default = "default",
}

const inputComponentsStyleMap: Record<InputStyle, string> = {
  [InputStyle.default]:
    "w-full border-b border-black focus:outline-none focus:border-b focus:border-black text-lg ",
};

export function getComponentByStyle(style: InputStyle) {
  return inputComponentsStyleMap[style] || "";
}
