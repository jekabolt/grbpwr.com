import { SVGProps } from "react";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const blazerLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "shoulders",
    y: -30,
    xStart: 95,
    xEnd: 335,
  },
  {
    type: "horizontal",
    name: "chest",
    y: 150,
    xStart: 95,
    xEnd: 335,
  },
  {
    type: "vertical",
    name: "length",
    x: 280,
    yStart: 40,
    yEnd: 380,
  },
  {
    type: "vertical",
    view: "diagonal",
    name: "sleeve",
    x: 388,
    xEnd: 470,
    yStart: 50,
    yEnd: 353,
  },
];

export function BlazerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper
      lines={blazerLines}
      originalViewBox="110 -75 212 557"
      {...props}
    >
      <g
        clip-path="url(#a)"
        stroke="#000"
        stroke-miterlimit="10"
        stroke-width="2"
      >
        <path d="m214.84 275.04-51.09-241.67-6.85-32.407" />
        <path d="m214.84 275.04 0.239 121.22" />
        <path d="m169.72 63.533c0.671 0-1.194 1.112-14.265 10.824s-26.312 19.424-26.312 19.424l85.688 181.26" />
        <path
          d="m143.47 23.797-51.29 28.542-83.957 307.91 54.127 14.46 29.17-108.63 0.3341 129.96 246.29 0.074-0.302-130 29.511 108.75 54.127-14.46-83.336-308.2-51.765-28.098"
          strokeLinecap="round"
        />
        <path d="m92.179 52.34-0.6594 213.74" />
        <path d="m338.13 52.254-0.283 213.85" />
        <path d="m155.46 74.358-31.981-16.458 33.342-57.011 116.01 0.050413" />
        <path d="m214.84 275.04 57.997-274.1" />
        <path d="m259.98 63.609c-0.671 0 1.193 1.112 14.264 10.824 13.071 9.7118 26.312 19.424 26.312 19.424l-85.717 181.19" />
        <path d="m274.24 74.432 31.978-16.458-33.389-57.035-115.94-0.050413" />
        <path d="m266.33 32.047h-102.5" />
      </g>
    </SvgWrapper>
  );
}
