import { SVGProps } from "react";

import { HorizontaltLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function SkirtIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1294"
      height="2047"
      viewBox="0 0 1294 2047"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontaltLine info="waist" y={300} xStart={180} xEnd={1110} />
      <g clip-path="url(#clip0_943_4449)">
        <path
          d="M646.591 430H1114.67V1616.52H597.941"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M647.08 430H179V1616.52H621.11V1046.26"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M179.449 496.61L1113.67 496.67"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M620.941 1062.9L621.111 430.26"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M672.672 1616.06L672.682 494.95"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M356.109 495.16L179.109 761.36"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M938.109 495.16L1115.11 761.36"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M660.109 452.26H638.109V476.46H660.109V452.26Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M658.109 576.89H636.109V601.09H658.109V576.89Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M658.109 701.51H636.109V725.71H658.109V701.51Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M658.109 826.14H636.109V850.34H658.109V826.14Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M658.109 950.76H636.109V974.96H658.109V950.76Z"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <HorizontaltLine info="hips" y={800} xStart={180} xEnd={1110} />
        <VerticalLine lengthInfo="length" x={930} yStart={440} yEnd={1610} />
      </g>
      <defs>
        <clipPath id="clip0_943_4449">
          <rect
            width="941.67"
            height="1192.52"
            fill="white"
            transform="translate(176 427)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
