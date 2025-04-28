import { HorizontaltLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function SweaterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1472"
      height="1484"
      viewBox="0 -200 1472 1484"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontaltLine info="shoulders" y={-120} xStart={328} xEnd={1145} />
      <g clip-path="url(#clip0_943_4548)">
        <path
          d="M3.62891 1172.51L326.379 120.76L541.159 3H935.399L1148.38 121.25L1468.13 1172.51L1245.39 1277.25L1148.38 959.24V1281H326.379V956.24L226.369 1277.25L3.62891 1172.51Z"
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
          d="M542.488 3L608.488 75H870.728L935.378 5"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M1148.38 1240H326.379"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <path
          d="M982.378 32L898.908 119H582.818L495.078 28"
          stroke="black"
          strokeWidth="6"
          strokeMiterlimit="10"
        />
        <HorizontaltLine info="chest" y={400} xStart={328} xEnd={1145} />
        <VerticalLine lengthInfo="length" x={930} yStart={15} yEnd={1330} />
      </g>
      <VerticalLine
        lengthInfo="sleeve"
        view="diagonal"
        x={1300}
        xEnd={1630}
        yStart={120}
        yEnd={1100}
      />
      <defs>
        <clipPath id="clip0_943_4548">
          <rect width="1471.76" height="1284" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
