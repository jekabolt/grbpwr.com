import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function VestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 -40 251 510"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontalLine
        info="100"
        measurementType="shoulders"
        y={10}
        xStart={15}
        xEnd={235}
      />
      <VerticalLine info="100" x={300} yStart={40} yEnd={400} />
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
      <HorizontalLine
        info="100"
        measurementType="chest"
        y={150}
        xStart={15}
        xEnd={235}
      />
      <HorizontalLine
        info="100"
        measurementType="waist"
        y={300}
        xStart={2}
        xEnd={248}
      />
    </svg>
  );
}
