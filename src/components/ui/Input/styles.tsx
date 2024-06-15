export enum InputStyle {
  default = "default",
  simple = "simple",
}

const inputComponentsStyleMap: Record<InputStyle, string> = {
  [InputStyle.default]: "",
  [InputStyle.simple]:
    "w-full border-b border-black focus:outline-none focus:border-b focus:border-black text-lg ",
};

export function getInputStyleClass(style: InputStyle) {
  return inputComponentsStyleMap[style] || "";
}
