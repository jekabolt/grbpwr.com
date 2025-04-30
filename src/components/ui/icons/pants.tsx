import { SVGProps } from "react";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const pantsLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "waist",
    xStart: 2,
    xEnd: 210,
    y: -20,
  },
  {
    type: "horizontal",
    name: "leg open",
    xStart: 2,
    xEnd: 95,
    y: 480,
  },
  {
    type: "vertical",
    name: "length",
    x: 270,
    yStart: 5,
    yEnd: 455,
  },
  {
    type: "vertical",
    x: 105.94,
    yStart: 127,
    yEnd: 455.65,
    // rectXOffset: 35,
  },
];
export function PantsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper lines={pantsLines} originalViewBox="0 -50 212 557" {...props}>
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="m105.94 0.67383h105.38v455.65h-94.317v-330.26h-11.063" />
        <path d="m106.06 0.67383h-105.38v455.65h94.317v-330.26h11.063" />
        <path d="m94.992 143.17v-142.5" />
        <path d="m44.21 0.57227-0.063 18.294-28.612 34.622h-14.859" />
        <path d="m94.758 70.867h22.236l2e-3 -70.141" />
        <path d="m0.67578 448.2h94.317" />
        <path d="m117.23 448.2h92.753" />
        <path d="m167.86 0.57227 0.061 18.294 28.612 34.622h14.859" />
      </g>
    </SvgWrapper>
  );
}
