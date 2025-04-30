import { SVGProps } from "react";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const vestLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "shoulders",
    y: 10,
    xStart: 15,
    xEnd: 235,
  },
  {
    type: "vertical",
    x: 300,
    yStart: 40,
    yEnd: 400,
  },
  {
    type: "horizontal",
    name: "chest",
    y: 150,
    xStart: 15,
    xEnd: 235,
  },
  {
    type: "horizontal",
    name: "waist",
    y: 300,
    xStart: 2,
    xEnd: 248,
  },
];

export function VestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper lines={vestLines} originalViewBox="20 -50 212 541" {...props}>
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path
          d="m125.12 374.01v-0.039l0.075-202.67 75.264-137.28 35.224 18.569"
          strokeLinecap="round"
        />
        <path d="m249.08 277 0.304 116.33-79.78 15.63-44.406-35.049-0.075 0.061-44.331 34.961-79.882-15.67 0.36127-116.77-0.13548-103.52v-0.04l13.575-19.478v-101.4l35.091-18.569 75.396 137.82" />
        <path d="m235.68 52.59v100.87l13.532 19.484-0.138 104.06" />
        <path d="m141.6 221.36h-6.623v7.286h6.623v-7.286z" />
        <path d="m141.6 261.18h-6.623v7.285h6.623v-7.285z" />
        <path d="m141.6 300.99h-6.623v7.286h6.623v-7.286z" />
        <path d="m50.527 33.115 149.32 0.6021" strokeLinecap="round" />
      </g>
    </SvgWrapper>
  );
}
