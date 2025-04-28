import { SVGProps } from "react";

import { VerticalLine } from "./guide-lines/vertical-line";

export function OtherIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1306"
      height="1707"
      viewBox="0 -50 1306 1707"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <VerticalLine
        lengthInfo="length"
        view="diagonal"
        x={-30}
        xEnd={550}
        yStart={60}
        yEnd={400}
        yOffset={1200}
      />
      <VerticalLine
        lengthInfo="width"
        view="diagonal"
        x={1320}
        xEnd={760}
        yStart={90}
        yEnd={410}
        yOffset={1200}
      />
      <VerticalLine lengthInfo="height" x={1460} yStart={400} yEnd={1100} />
      <path
        d="M1302.04 378.46L652.52 3.45996L3 378.46V1128.46L652.52 1503.46L1302.04 1128.46V378.46Z"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M651.77 1503.45V753.45"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M1302.77 378.45L651.77 753.45"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M2.26953 378.45L651.77 753.45"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
    </svg>
  );
}
