import {
  MeasurementLine,
  SvgWrapper,
} from "../categories-thumbnails/svg-wrapper";

const sweaterLines: MeasurementLine[] = [
  {
    type: "horizontal",
    name: "shoulders",
    y: 40,
    xStart: 145,
    xEnd: 396,
  },
  {
    type: "horizontal",
    name: "chest",
    y: 200,
    xStart: 145,
    xEnd: 396,
  },
  {
    type: "vertical",
    name: "length",
    x: 350,
    yStart: 90,
    yEnd: 450,
  },
  {
    type: "vertical",
    view: "diagonal",
    x: 450,
    xEnd: 540,
    yStart: 100,
    yEnd: 410,
  },
];
export function SweaterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <SvgWrapper lines={sweaterLines} originalViewBox="160 0 212 541" {...props}>
      <g stroke="#000" strokeMiterlimit="10" strokeWidth="2">
        <path d="m143.2 109.49 66.62-36.565h122l66.062 36.663" />
        <path d="m397.73 368.59v99.485h-254.37v-100.41" />
        <path d="m143.2 109.49 0.155 263.73" />
        <path d="m397.88 109.59-0.154 264.56" />
        <path d="m210.23 72.928 20.425 22.262h81.151l20.007-21.643" />
        <path d="m397.73 455.4h-254.37" />
        <path d="m346.36 81.895-25.83 26.899h-97.816l-27.151-28.136" />
        <path
          d="m397.88 332.83 30.608 113.39 56.142-15.076-86.747-321.55"
          strokeLinecap="round"
        />
        <path
          d="m143.2 332.83-30.606 113.39-56.141-15.076 86.744-321.65"
          strokeLinecap="round"
        />
        <path d="m220.6 83.75h101.81" strokeLinecap="round" />
      </g>
    </SvgWrapper>
  );
}
