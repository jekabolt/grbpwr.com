import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { SleeveLine } from "./guide-lines/sleeve-line";
import { VerticalLine } from "./guide-lines/vertical-line";

interface TShirtIconProps extends SVGProps<SVGSVGElement> {
  lengthInfo?: string;
  waistInfo?: string;
  sleeveInfo?: string;
  widthInfo?: string;
}

export function TShirtIcon({
  lengthInfo = "56",
  waistInfo = "70",
  sleeveInfo = "25",
  widthInfo = "50",
  ...props
}: TShirtIconProps) {
  return (
    <svg
      width="2000"
      height="1425"
      viewBox="-400 -200 2000 1425"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontalLine info="103" y={-120} />
      <g clipPath="url(#clip0_1334_5631)">
        <path
          d="M149.34 120.76L364.12 3H758.36L971.34 121.17"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M971.34 569.24V1222H149.34V566.24"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M149.34 120.76V566.24"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M971.34 121.17V569.24"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M364.461 3L430.461 75H692.701L758.701 3"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M806.34 28L720.87 119H404.79L317.34 26"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M971.34 1184H149.34"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M971.34 697L1116.66 657.57L971.34 121.17"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
        <path
          d="M149 697L3.67969 657.57L149 121"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
        <path
          d="M399 38L724 38"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
        <HorizontalLine info="12" />
        <VerticalLine lengthInfo={lengthInfo} />
        <SleeveLine sleeveInfo={sleeveInfo} />
      </g>
      <defs>
        <clipPath id="clip0_1334_5631">
          <rect x="-400" y="-100" width="2000" height="1425" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
