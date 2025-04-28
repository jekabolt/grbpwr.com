import { SVGProps } from "react";

import { HorizontaltLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function PantsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1294"
      height="2647"
      viewBox="0 -400 1294 2647"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontaltLine info="103" xStart={190} xEnd={1124} y={-120} />
      <path
        d="M657.469 7.71973H1125.55V2039.38H706.609V566.8H657.469"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M657.959 7.72973L189.879 7.71973V2039.38H608.819V566.8H657.959"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M190.328 68.2793L1124.56 68.3393"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M608.82 643.09V7.72949"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M383.249 68.2793L382.969 149.839L255.879 304.209H189.879"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M607.777 320.7H706.557V66.7695"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M189.879 2003.15H608.819"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M707.598 2003.15H1119.59"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M932.457 68.2793L932.737 149.839L1059.83 304.209H1125.83"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <VerticalLine
        lengthInfo="65 inseam"
        x={655}
        yStart={570}
        yEnd={2047}
        textY={1023}
        rectXOffset={125}
      />
      <VerticalLine
        lengthInfo="65 length"
        x={1300}
        yStart={20}
        yEnd={2047}
        textY={1023}
      />
      <HorizontaltLine
        info="25"
        xStart={190}
        xEnd={600}
        y={2150}
        rectYOffset={60}
      />
    </svg>
  );
}
