import { SVGProps } from "react";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const jacketLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "shoulders",
    y: -20,
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

export function JacketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper
      lines={jacketLines}
      originalViewBox="110 -75 212 557"
      {...props}
    >
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="m215.45 54.01-0.101 0.169-0.102-0.169 0.102-0.0919 0.101 0.0919z" />
        <path d="m257.07 16.691-41.723 37.226-41.247-36.802 82.97-0.424z" />
        <path d="m338.93 383.95h-246.86" />
        <path d="m273.44 0.89453-0.023 1.2156-16.251 14.498h-83.632l-16.444-14.67 0.021-1.0436h116.33z" />
        <path d="m289.91 27.384-58.981 52.626-15.583-25.833 0.101-0.169-0.101-0.0919 41.723-37.226 0.093-0.083 16.25-14.498 0.813-0.72639 14.172 23.493 1.513 2.5083z" />
        <path d="m215.45 54.01-0.101 0.169-0.102-0.169 0.102-0.0919 0.101 0.0919z" />
        <path d="m215.35 55.447 0.074 328.5" />
        <path d="m215.25 54.009 0.102 0.169-15.584 25.833-58.981-52.626 1.062-1.7611 14.623-24.24 0.619 0.55443 16.445 14.67 0.568 0.507 41.248 36.802-0.102 0.0919z" />
        <path d="m215.45 54.01-0.101 0.169-0.102-0.169 0.102-0.0919 0.101 0.0919z" />
        <path
          d="m142.3 24.73-49.905 27.68-84.152 307.84 54.253 14.456 29.238-108.61 0.3349 129.93 246.86 0.074-0.302-129.98 29.579 108.73 54.254-14.456-83.531-308.14-50.53-27.386"
          stroke-linecap="round"
        />
        <path d="m92.395 52.41-0.6609 213.69" />
        <path d="m338.91 52.324-0.284 213.81" />
      </g>
    </SvgWrapper>
  );
}
