import { SVGProps } from "react";

import { HorizontalLine } from "./guide-lines/horizontal-line";
import { VerticalLine } from "./guide-lines/vertical-line";

export function SkirtIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="160 15 212 557"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <HorizontalLine
        measurementType="waist"
        info="103"
        y={50}
        xStart={100}
        xEnd={440}
      />
      <g clipPath="url(#a)" stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="m270.01 77.109h172.88v438.78h-190.85" />
        <path d="m270.19 77.109h-172.88v438.78h163.29v-210.89" />
        <path d="m260.54 311.16 0.063-233.95" />
        <path d="m279.64 515.72 0.144-438.51" />
        <path d="m162.72 77.168-65.373 98.442" />
        <path d="m377.68 77.168 65.369 98.442" />
        <path d="m274.27 86.82h-8.125v8.9493h8.125v-8.9493z" />
        <path d="m274.27 132.54h-8.125v8.949h8.125v-8.949z" />
        <path d="m274.27 178.25h-8.125v8.949h8.125v-8.949z" />
        <path d="m274.27 223.98h-8.125v8.949h8.125v-8.949z" />
        <path d="m274.27 269.69h-8.125v8.95h8.125v-8.95z" />
      </g>

      <HorizontalLine
        measurementType="hips"
        info="103"
        y={200}
        xStart={100}
        xEnd={440}
      />
      <VerticalLine info="212" x={375} yStart={80} yEnd={510} />
      <HorizontalLine
        measurementType="bottom width"
        info="103"
        y={540}
        xStart={100}
        xEnd={440}
      />
    </svg>
  );
}
