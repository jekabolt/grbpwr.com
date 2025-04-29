import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";

export function BraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 541 541"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g stroke="#000" stroke-miterlimit="10" stroke-width="2">
        <path d="m259.82 447.07-130.28-182.87v-187.12h-17.586v185l-55.814 112.27 23.322 90.585h381.09l23.319-90.585-55.81-112.27v-185h-17.587v187.12l-130.28 182.87h-27.598" />
        <path d="m260.11 447.07h-184.96" />
        <path d="m280.31 447.07h184.96" />
      </g>
      <HorizontalLine
        measurementType="chest"
        info="100"
        y={500}
        xStart={85}
        xEnd={455}
      />
    </svg>
  );
}
