import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function PantsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 -50 212 557"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        clipPath="url(#a)"
        stroke="#000"
        stroke-miterlimit="10"
        stroke-width="2"
      >
        <path d="m105.94 0.67383h105.38v455.65h-94.317v-330.26h-11.063" />
        <path d="m106.06 0.67383h-105.38v455.65h94.317v-330.26h11.063" />
        <path d="m94.992 143.17v-142.5" />
        <path d="m44.21 0.57227-0.063 18.294-28.612 34.622h-14.859" />
        <path d="m94.758 70.867h22.236l2e-3 -70.141" />
        <path d="m0.67578 448.2h94.317" />
        <path d="m117.23 448.2h92.753" />
        <path d="m167.86 0.57227 0.061 18.294 28.612 34.622h14.859" />
      </g>
      <g>
        <HorizontalLine
          measurementType="waist"
          info="103"
          xStart={2}
          xEnd={210}
          y={-20}
        />
        <HorizontalLine
          measurementType="leg open"
          info="65"
          xStart={2}
          xEnd={95}
          y={480}
        />
        <VerticalLine lengthInfo="40" x={270} yStart={5} yEnd={455} />
        <VerticalLine
          lengthInfo="65"
          x={105.94}
          yStart={127}
          yEnd={455.65}
          rectXOffset={35}
        />
      </g>
      <defs>
        <clipPath id="a">
          <rect width="212" height="557" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
}
