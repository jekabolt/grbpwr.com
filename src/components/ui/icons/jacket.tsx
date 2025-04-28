import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function JacketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1472"
      height="1540"
      viewBox="0 -200 1472 1540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontalLine info="shoulders" y={-120} xStart={328} xEnd={1145} />
      <g clip-path="url(#clip0_943_4535)">
        <path
          d="M735.52 182.17L735.18 182.74L734.84 182.17L735.18 181.86L735.52 182.17Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M874.7 56.2998L735.18 181.86L597.25 57.7298L874.7 56.2998Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M1468.18 1155.53L1245.44 1260.27L1148.43 1014.26V1336.02H326.43V1011.26L226.42 1260.27L3.67969 1155.53L326.43 175.78L489.39 86.4302L485.84 92.3702L683.07 269.87L735.18 182.74L787.29 269.87L984.52 92.3702L979.46 83.9102L1148.43 176.27L1468.18 1155.53Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M326.43 175.78V1029.26"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M1148.43 176.27V1032.26"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M1148.43 1295.02H326.43"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M929.429 3.01953L929.349 7.11953L875.009 56.0195H595.349L540.359 6.53953L540.429 3.01953H929.429Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M984.52 92.3699L787.29 269.87L735.18 182.74L735.52 182.17L735.18 181.86L874.7 56.2999L875.01 56.0199L929.35 7.11992L932.07 4.66992L979.46 83.9099L984.52 92.3699Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M735.52 182.17L735.18 182.74L734.84 182.17L735.18 181.86L735.52 182.17Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M735.18 187.02L735.43 1295.02"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M734.84 182.17L735.18 182.74L683.07 269.87L485.84 92.3699L489.39 86.4299L538.29 4.66992L540.36 6.53992L595.35 56.0199L597.25 57.7299L735.18 181.86L734.84 182.17Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M735.52 182.17L735.18 182.74L734.84 182.17L735.18 181.86L735.52 182.17Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <HorizontalLine info="bust" y={500} xStart={328} xEnd={1145} />
        <HorizontalLine info="waist" y={1000} xStart={328} xEnd={1145} />
        <VerticalLine
          lengthInfo="length"
          x={930}
          yStart={15}
          yEnd={1330}
          rectXOffset={125}
        />
      </g>
      <VerticalLine
        lengthInfo="sleeve"
        view="diagonal"
        x={1300}
        xEnd={1650}
        yStart={150}
        yEnd={1100}
      />
      <defs>
        <clipPath id="clip0_943_4535">
          <rect width="1471.85" height="1339.02" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
