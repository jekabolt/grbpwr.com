import { SVGProps } from "react";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const otherLines: MeasurementLine[] = [
  {
    type: "vertical",
    x: 480,
    yStart: 170,
    yEnd: 365,
  },
  {
    type: "vertical",
    view: "diagonal",
    x: 95,
    xEnd: 230,
    yStart: 420,
    yEnd: 500,
  },
  {
    type: "vertical",
    view: "diagonal",
    x: 445,
    xEnd: 300,
    yStart: 420,
    yEnd: 500,
  },
];
export function OtherIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper lines={otherLines} originalViewBox="160 0 212 541" {...props}>
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="M436 175L270.5 79L105 175V367L270.5 463L436 367V175Z" />
        <path d="m270.31 463.11v-192.61" />
        <path d="m436.42 174.19-166.11 96.305" />
        <path d="m104.58 174.19 165.73 96.305" />
      </g>
    </SvgWrapper>
  );
}
