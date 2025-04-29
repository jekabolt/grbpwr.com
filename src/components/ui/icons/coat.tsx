import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function CoatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="150 -40 212 597"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontalLine
        measurementType="sholders"
        info="103"
        xStart={168}
        xEnd={367}
        y={0}
      />
      <VerticalLine
        info="40"
        view="diagonal"
        x={408}
        xEnd={480}
        yStart={70}
        yEnd={303}
      />
      <g clipPath="url(#a)" stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="m266.98 68.681-0.084 0.1396-0.083-0.1396 0.083-0.0758 0.084 0.0758z" />
        <path d="m301.16 37.809-34.267 30.796-33.875-30.446 68.142-0.3507z" />
        <path d="m166.5 67.074 40.023-21.876-0.872 1.4569 48.44 43.536 12.798-21.37 12.799 21.37 48.44-43.536-1.243-2.075 41.499 22.653" />
        <path d="m368.39 272.77v243.5h-201.88v-244.23" />
        <path d="m166.5 67.074v209.37" />
        <path d="m368.39 67.234v209.95" />
        <path d="m368.39 506.21h-201.88" />
        <path d="m314.6 24.74-0.02 1.0056-13.346 11.994h-68.685l-13.505-12.136 0.017-0.8634h95.539z" />
        <path d="m328.13 46.655-48.44 43.536-12.798-21.37 0.083-0.1398-0.083-0.0761 34.266-30.796 0.076-0.0687 13.346-11.994 0.668-0.6009 11.639 19.435 1.243 2.075z" />
        <path d="m266.98 68.681-0.084 0.1396-0.083-0.1396 0.083-0.0758 0.084 0.0758z" />
        <path d="m266.9 69.871 0.061 436.34" />
        <path d="m266.81 68.68 0.083 0.1398-12.798 21.37-48.44-43.536 0.872-1.4569 12.01-20.053 0.508 0.4587 13.506 12.136 0.467 0.4194 33.875 30.446-0.083 0.0761z" />
        <path d="m266.98 68.681-0.084 0.1396-0.083-0.1396 0.083-0.0758 0.084 0.0758z" />
        <path d="m284.28 140.7h-5.403v5.936h5.403v-5.936z" />
        <path d="m284.28 197.6h-5.403v5.936h5.403v-5.936z" />
        <path d="m284.28 254.51h-5.403v5.935h5.403v-5.935z" />
        <path
          d="m368.39 351.69 0.245-107.43 23.797 89.851 44.559-11.96-68.601-254.91"
          strokeLinecap="round"
        />
        <path
          d="m166.5 351.44-0.245-107.43-23.797 89.85-44.557-11.959 68.599-254.83"
          strokeLinecap="round"
        />
      </g>
      <g>
        <HorizontalLine
          measurementType="chest"
          info="103"
          xStart={168}
          xEnd={367}
          y={170}
        />
        <VerticalLine info="40" x={320} yStart={60} yEnd={500} />
      </g>
    </svg>
  );
}
