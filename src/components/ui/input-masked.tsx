import { InputMask as InputMaskControl, Replacement } from "@react-input/mask";

import Input, { type InputProps } from "./input";

export interface InputMaskProps extends InputProps {
  mask: string;
  replacement?: string | Replacement;
}

export function InputMask({
  mask,
  replacement = { _: /\d/, d: /\d/, m: /\d/, y: /\d/ },
  type = "text",
  label,
  name,
  errorMessage,
  ...props
}: InputMaskProps) {
  return (
    <InputMaskControl
      component={Input}
      mask={mask}
      replacement={replacement}
      name={name}
      label={label}
      type={type}
      errorMessage={errorMessage}
      {...props}
    />
  );
}
