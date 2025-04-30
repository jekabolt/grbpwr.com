import { SVGProps } from "react";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const glovesLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "width",
    y: 370,
    xStart: 5,
    xEnd: 170,
  },
  {
    type: "vertical",
    x: 230,
    yStart: 30,
    yEnd: 340,
  },
];

export function GlovesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper lines={glovesLines} originalViewBox="0 -100 175 542" {...props}>
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="1.8063">
        <path d="m139.84 30.976h33.567v288.41h-172.5v-196.59h38.234v-114.4h33.568v22.579" />
        <path d="m72.703 8.3995v-7.4933h33.568v139.66" />
        <path d="m72.703 140.56v-109.58" />
        <path d="m106.28 32.029v-23.633h33.568v132.16" />
        <path d="m39.141 187.53v-64.727" />
        <path d="m72.703 32.03v-1.0537" />
        <path d="m0.90625 319.39v20.839h172.5v-20.839" />
      </g>
    </SvgWrapper>
  );
}
