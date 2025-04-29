import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function BeltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="-50 -250 541 541"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontalLine
        measurementType="width to last"
        info="100"
        y={-70}
        xStart={5}
        xEnd={375}
      />
      <HorizontalLine
        measurementType="width to first"
        info="100"
        y={-20}
        xStart={5}
        xEnd={310}
      />
      <HorizontalLine
        measurementType="length"
        info="100"
        y={90}
        xStart={5}
        xEnd={415}
      />
      <VerticalLine
        lengthInfo="100"
        x={425}
        yStart={0}
        yEnd={60}
        rectXOffset={35}
      />
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="m47.781 10.579v37.638h48.598v-37.638h-48.598z" />
        <path d="m106.18 10.579h298.12l14.089 6.1706v25.5l-14.089 5.9672h-298.12v-37.638z" />
        <path d="m5.7188 58.391v-24.617h42.063v14.445h23.074v10.172h-65.137z" />
        <path d="m5.7188 0.60965 65.137-3e-6v9.969h-23.074v14.445h-42.063v-24.414z" />
        <path d="m14.09 33.772v14.445h33.692v-14.445h-33.692z" />
        <path d="m14.09 10.579v14.445h33.692v-14.445h-33.692z" />
        <path d="m0.61328 25.023v8.7483h47.168v-8.7483h-47.168z" />
        <path d="m96.379 4.8827v49.234h9.8011v-49.234h-9.8011z" />
        <path d="m375.01 27.262v4.4759h4.941v-4.4759h-4.941z" />
        <path d="m340.91 27.262v4.4759h4.942v-4.4759h-4.942z" />
        <path d="m306.81 27.262v4.4759h4.942v-4.4759h-4.942z" />
      </g>
    </svg>
  );
}
