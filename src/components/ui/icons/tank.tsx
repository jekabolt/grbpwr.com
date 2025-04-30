import { SVGProps } from "react";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const tankLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "shoulders",
    y: 50,
    xStart: 162,
    xEnd: 378,
  },
  {
    type: "horizontal",
    name: "chest",
    y: 200,
    xStart: 162,
    xEnd: 378,
  },
  {
    type: "vertical",
    x: 460,
    yStart: 95,
    yEnd: 455,
  },
];

export function TankIcon({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper lines={tankLines} originalViewBox="160 0 212 541" {...props}>
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="m210.66 87.902 19.87 21.676h78.949l19.869-21.676" />
        <path d="m196.48 94.826 0.494 0.5268 25.831 27.471h95.161l25.43-27.074 0.301-0.3221" />
        <path d="m393.37 445.86h-247.47" />
        <path d="m218.46 95.73h103.56" strokeLinecap="round" />
        <path d="m393.37 265.99-13.848-19.87v-130.22l-36.127-20.15-14.077-7.8124-0.066-0.0362h-118.69l-13.589 7.4512-37.223 20.548v130.24l-13.849 19.909v188.84h247.47v-188.9zv0.141" />
      </g>
    </SvgWrapper>
  );
}
