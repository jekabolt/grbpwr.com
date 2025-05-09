import { SVGProps } from "react";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const shortsLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "waist",
    y: 50,
    xStart: 82,
    xEnd: 458,
  },
  {
    type: "horizontal",
    name: "hips",
    y: 200,
    xStart: 82,
    xEnd: 458,
  },
  {
    type: "vertical",
    name: "inseam",
    x: 270,
    yStart: 310,
    yEnd: 515,
  },
  {
    type: "vertical",
    name: "length",
    x: 375,
    yStart: 80,
    yEnd: 510,
  },
];

export function ShortIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper lines={shortsLines} originalViewBox="160 5 212 557" {...props}>
      <g clipPath="url(#a)" stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="m269.9 77.221h189.88v438.56h-169.95v-211.25h-19.935" />
        <path d="m270.1 77.221h-189.88v438.56h169.95v-211.25h19.934" />
        <path d="m250.16 335.55v-258.33" />
        <path d="m158.66 77.037-0.114 33.165-51.556 62.764h-26.773" />
        <path d="m249.74 180.48h40.067l5e-3 -103.25" />
        <path d="m80.219 501.06h169.95" />
        <path d="m290.24 501.05 170.54-0.077" />
        <path d="m381.45 77.037 0.11 33.165 51.555 62.764h26.774" />
      </g>
    </SvgWrapper>
  );
}
