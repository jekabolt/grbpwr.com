import { SVGProps } from "react";

import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const skirtLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "waist",
    y: 50,
    xStart: 100,
    xEnd: 440,
  },
  {
    type: "horizontal",
    name: "hips",
    y: 200,
    xStart: 100,
    xEnd: 440,
  },
  {
    type: "horizontal",
    name: "bottom width",
    y: 540,
    xStart: 100,
    xEnd: 440,
  },
  {
    type: "vertical",
    x: 375,
    yStart: 80,
    yEnd: 510,
  },
];
export function SkirtIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper lines={skirtLines} originalViewBox="160 15 212 557" {...props}>
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
    </SvgWrapper>
  );
}
