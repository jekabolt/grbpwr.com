import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function CoatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1472"
      height="2311"
      viewBox="0 -200 1472 2311"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontalLine info="shoulders" y={-120} xStart={335} xEnd={1140} />
      <g clipPath="url(#clip0_943_4492)">
        <path
          d="M735.52 182.169L735.18 182.739L734.84 182.169L735.18 181.859L735.52 182.169Z"
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
          d="M1468.18 1155.53L1245.44 1260.27L1148.43 1014.26V2007.02H326.43V1011.26L226.42 1260.27L3.67969 1155.53L326.43 175.779L489.39 86.4292L485.84 92.3692L683.07 269.869L735.18 182.739L787.29 269.869L984.52 92.3692L979.46 83.9092L1148.43 176.269L1468.18 1155.53Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M326.43 175.779V1029.26"
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
          d="M1148.43 1966.02H326.43"
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
          d="M735.52 182.169L735.18 182.739L734.84 182.169L735.18 181.859L735.52 182.169Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M735.18 187.02L735.43 1966.02"
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
          d="M735.52 182.169L735.18 182.739L734.84 182.169L735.18 181.859L735.52 182.169Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M805.988 475.81H783.988V500.01H805.988V475.81Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M805.988 707.81H783.988V732.01H805.988V707.81Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M805.988 939.81H783.988V964.01H805.988V939.81Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <HorizontalLine info="chest" y={600} xStart={335} xEnd={1140} />
        <HorizontalLine info="waist" y={1000} xStart={335} xEnd={1140} />
        <VerticalLine
          lengthInfo="length"
          x={1000}
          yStart={100}
          yEnd={2000}
          rectYOffset={200}
        />
      </g>
      <VerticalLine
        lengthInfo="sleeve"
        view="diagonal"
        x={1300}
        xEnd={1630}
        yStart={140}
        yEnd={1080}
      />
      <defs>
        <clipPath id="clip0_943_4492">
          <rect width="1471.85" height="2010.02" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
