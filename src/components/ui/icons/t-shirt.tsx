import { SVGProps } from "react";
import { common_ProductMeasurement } from "@/api/proto-http/frontend";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const tshirtLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "shoulders",
    y: 30,
    xStart: 131,
    xEnd: 409,
  },
  {
    type: "horizontal",
    name: "chest",
    y: 200,
    xStart: 131,
    xEnd: 409,
  },
  {
    type: "vertical",
    name: "length",
    x: 350,
    yStart: 85,
    yEnd: 460,
  },
  {
    type: "vertical",
    name: "sleeve",
    view: "diagonal",
    x: 450,
    xEnd: 500,
    yStart: 100,
    yEnd: 270,
  },
];

interface TShirtIconProps extends SVGProps<SVGSVGElement> {
  measurements?: common_ProductMeasurement[];
}

export function TShirtIcon({ measurements, ...props }: TShirtIconProps) {
  return (
    <SvgWrapper
      lines={tshirtLines}
      originalViewBox="160 0 212 541"
      measurements={measurements}
      {...props}
    >
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="m129.9 104.39 73.119-39.394h134.22l72.507 39.531" />
        <path d="M409.736 256.393V478H129.895V255.375" />
        <path d="m129.9 104.53v150.84" />
        <path d="m409.74 104.53v152.92" />
        <path d="m203.75 65 22.292 24.967h88.574l22.293-24.967" />
        <path d="m352.52 73.993-28.729 30.538h-106.24l-29.395-31.209" />
        <path d="m409.74 465.52h-279.84" />
        <path
          d="m409.74 300.11 48.894-13.392-48.894-182.18"
          strokeLinecap="round"
        />
        <path
          d="m129.89 300.11-48.894-13.388 48.894-182.19"
          strokeLinecap="round"
        />
        <path d="m215.2 76.443h110.27" strokeLinecap="round" />
      </g>
    </SvgWrapper>
  );
}
