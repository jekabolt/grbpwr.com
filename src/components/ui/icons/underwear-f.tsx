import { SVGProps } from "react";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const underwearFLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "waist",
    y: 120,
    xStart: 40,
    xEnd: 500,
  },
];

export function UnderwearFIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper
      lines={underwearFLines}
      originalViewBox="160 0 212 541"
      {...props}
    >
      <g stroke="#000" stroke-miterlimit="10" stroke-width="2">
        <path d="m299.33 387.34h-58.181" />
        <path d="m41.156 176.85v-22.701h458.69v22.701l-200 211.01h-59.22l-199.48-211.01z" />
        <path d="m240.63 387.85-35.323-111.44-58.181-59.845-105.97-39.725" />
        <path d="m205.31 276.42-58.181-59.846" />
        <path d="m299.33 387.85 35.324-111.44 58.18-59.846 106.92-40.153" />
      </g>
    </SvgWrapper>
  );
}
