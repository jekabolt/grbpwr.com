import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function GlovesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 -100 175 542"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontalLine
        measurementType="width"
        info="30"
        y={370}
        xStart={5}
        xEnd={170}
      />
      <VerticalLine info="50" x={230} yStart={30} yEnd={340} />
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="1.8063">
        <path d="m139.84 30.976h33.567v288.41h-172.5v-196.59h38.234v-114.4h33.568v22.579" />
        <path d="m72.703 8.3995v-7.4933h33.568v139.66" />
        <path d="m72.703 140.56v-109.58" />
        <path d="m106.28 32.029v-23.633h33.568v132.16" />
        <path d="m39.141 187.53v-64.727" />
        <path d="m72.703 32.03v-1.0537" />
        <path d="m0.90625 319.39v20.839h172.5v-20.839" />
      </g>
    </svg>
  );
}
