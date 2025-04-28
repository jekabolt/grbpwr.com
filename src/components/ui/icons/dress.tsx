import { SVGProps } from "react";

import { HorizontaltLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function DressIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1672"
      height="1988"
      viewBox="-100 0 1672 1988"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_943_4555)">
        <path
          d="M3.62891 1172.51L326.379 120.76L541.159 3H935.399L1148.38 121.25L1468.13 1172.51L1245.39 1277.25L1148.38 977.24V1985H326.379V974.24L226.369 1277.25L3.62891 1172.51Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M326.379 120.76V974.24"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M1148.38 121.25V977.24"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M980.678 30L735.378 409L490.078 29"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M1148.38 1944H326.379"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <VerticalLine
          lengthInfo="103"
          x={935}
          yStart={9}
          yEnd={1980}
          rectYOffset={100}
        />
        <HorizontaltLine info="100" y={600} xStart={330} xEnd={1140} />
      </g>
      <VerticalLine
        lengthInfo="65"
        x={1300}
        yStart={100}
        yEnd={1100}
        view="diagonal"
        xEnd={1630}
      />
      <defs>
        <clipPath id="clip0_943_4555">
          <rect width="1471.76" height="1988" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
