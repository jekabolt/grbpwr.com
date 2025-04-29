import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";

export function UnderwearMIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 541 541"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontalLine
        measurementType="waist"
        info="103"
        y={70}
        xStart={80}
        xEnd={460}
      />
      <g stroke="#000" stroke-miterlimit="10" stroke-width="2">
        <path d="m269.9 106.15h188.95v329.69h-169.11v-103.99h-19.838" />
        <path d="m270.1 106.15h-188.95v329.69h169.11v-103.99h19.837" />
        <path d="m250.27 362.66v-256.5" />
        <path d="m249.84 226.78h39.874v-120.73" />
        <path d="m81.152 421.22h169.11" />
        <path d="m290.14 421.22 169.7-0.076" />
      </g>
    </svg>
  );
}
