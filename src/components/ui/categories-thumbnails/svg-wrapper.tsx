import { SVGProps } from "react";
import { common_ProductMeasurement } from "@/api/proto-http/frontend";

import { HorizontalLine } from "../icons/guide-lines/horizontal-line";
import { VerticalLine } from "../icons/guide-lines/vertical-line";

const STANDARD_SIZE = {
  width: 600,
  height: 800,
  padding: 50,
};

const STANDARD_VIEWBOX = "0 0 600 800";

export type MeasurementLine = {
  type: "horizontal" | "vertical";
  name:
    | "waist"
    | "width"
    | "chest"
    | "shoulders"
    | "hips"
    | "bust"
    | "leg open"
    | "bottom width"
    | "width to last"
    | "width to first"
    | "length";
  y?: number;
  x?: number;
  xStart?: number;
  xEnd?: number;
  yStart?: number;
  yEnd?: number;
};

interface MeasurementSvgProps extends SVGProps<SVGSVGElement> {
  measurements?: common_ProductMeasurement[];
  lines: MeasurementLine[];
  originalViewBox?: string;
  children: React.ReactNode;
}

export function SvgWrapper({
  measurements = [],
  lines,
  originalViewBox,
  children,
  ...props
}: MeasurementSvgProps) {
  const normalizeTransform = (originalViewBox: string) => {
    const [origX, origY, origWidth, origHeight] = originalViewBox
      .split(" ")
      .map(Number);

    const contentWidth = STANDARD_SIZE.width - 2 * STANDARD_SIZE.padding;
    const contentHeight = STANDARD_SIZE.height - 2 * STANDARD_SIZE.padding;

    const scaleX = contentWidth / origWidth;
    const scaleY = contentHeight / origHeight;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (STANDARD_SIZE.width - origWidth * scale) / 2;
    const offsetY = (STANDARD_SIZE.height - origHeight * scale) / 2;

    const translateX = offsetX - origX * scale;
    const translateY = offsetY - origY * scale;

    return `translate(${translateX}, ${translateY}) scale(${scale})`;
  };

  return (
    <svg
      fill="none"
      viewBox={STANDARD_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <g transform={normalizeTransform(originalViewBox || STANDARD_VIEWBOX)}>
        {children}
        {lines.map((line, index) =>
          line.type === "horizontal" ? (
            <HorizontalLine
              key={`${line.name}-${index}`}
              measurementType={line.name}
              info={"100"}
              y={line.y || 0}
              xStart={line.xStart || 0}
              xEnd={line.xEnd || 0}
            />
          ) : (
            <VerticalLine
              key={`${line.name}-${index}`}
              info={"100"}
              x={line.x || 0}
              yStart={line.yStart || 0}
              yEnd={line.yEnd || 0}
            />
          ),
        )}
      </g>
    </svg>
  );
}
