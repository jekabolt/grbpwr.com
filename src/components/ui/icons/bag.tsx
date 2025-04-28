import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1415"
      height="1491"
      viewBox="0 -200 1415 1491"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1332.38 582L1293.8 334H1028.8V459H958.8V334H457.8V459H386.8V334H120.8L82.22 582L3.5 1088H1411.1L1332.38 582ZM831.4 631.25H584.2V527.75H831.4V631.25Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M1332.8 582H1332.38H831.398"
        stroke="currentColor"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M584.201 582H82.2208H81.8008"
        stroke="currentColor"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M1028.8 3V459H958.801V64H457.801V459H386.801V3H1028.8Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M831.399 527.75H584.199V631.25H831.399V527.75Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M762.801 567.9H652.801V592.1H762.801V567.9Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <HorizontalLine info="width" y={1200} xStart={0} xEnd={1410} />
      <VerticalLine lengthInfo="depth" x={700} yStart={350} yEnd={1090} />
      <VerticalLine lengthInfo="length" x={1500} yStart={350} yEnd={1090} />
    </svg>
  );
}
