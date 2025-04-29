import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function DressIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 -50 541 641"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <VerticalLine
        info="100"
        view="diagonal"
        x={420}
        xEnd={485}
        yStart={65}
        yEnd={290}
      />
      <HorizontalLine
        measurementType="chest"
        info="100"
        y={160}
        xStart={170}
        xEnd={372}
      />
      <HorizontalLine
        measurementType="bottom width"
        info="100"
        y={540}
        xStart={170}
        xEnd={372}
      />
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="m168.64 53.331 53.506-29.331h98.063l53.058 29.413" />
        <path d="m373.19 266.33v250.67h-204.46v-251.42" />
        <path d="m168.64 53.33 0.082 212.25" />
        <path d="m373.27 53.414-0.082 212.92" />
        <path d="m331.48 30.716-61.015 94.272-61.016-94.52" />
        <path d="m373.19 506.8h-204.46" />
        <path
          d="m373.43 341.89-0.251-109.05 24.602 91.22 45.127-12.129-69.645-258.52"
          strokeLinecap="round"
        />
        <path
          d="m168.48 341.89 0.251-109.05-24.6 91.22-45.126-12.129 69.642-258.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
