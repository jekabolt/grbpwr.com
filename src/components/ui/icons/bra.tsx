import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";

export function BraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1205"
      height="1492"
      viewBox="0 -150 1205 1492"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M573.82 1038.3L208.82 526.6V3H159.55V520.65L3.17969 834.81L68.5197 1088.28H553.56H1136.18L1201.51 834.81L1045.15 520.65V3H995.88V526.6L630.88 1038.3H553.56"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M574.649 1038.3H56.4688"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <path
        d="M631.238 1038.3H1149.42"
        stroke="black"
        strokeWidth="6"
        strokeMiterlimit="10"
      />
      <HorizontalLine info="width" xStart={70} xEnd={1135} y={1200} />
    </svg>
  );
}
