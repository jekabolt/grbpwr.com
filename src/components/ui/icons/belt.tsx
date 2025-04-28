import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";

export function BeltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="790"
      height="1552"
      viewBox="0 200 290 1552"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontalLine info="width to last" y={570} xStart={-850} xEnd={1000} />
      <HorizontalLine info="width to first" y={770} xStart={-850} xEnd={650} />
      <g transform="rotate(-90 145 1026)">
        <path
          d="M238 234H53V472H238V234Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M238 520V1980L207.67 2049H82.33L53 1980V520H238Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M3 28H124V234H53V347H3V28Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M287 28V347H238V234H167V28H287Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M124 69H53V234H124V69Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M238 69H167V234H238V69Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M167 3H124V234H167V3Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M266 472H24V520H266V472Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M156 1836.57H134V1860.77H156V1836.57Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M156 1669.57H134V1693.77H156V1669.57Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M156 1502.57H134V1526.77H156V1502.57Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
      </g>
      <HorizontalLine info="width" y={1270} xStart={-850} xEnd={1150} />
    </svg>
  );
}
