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

const MEASUREMENT_NAME_TO_ID: Record<string, string> = {
  waist: "1",
  inseam: "2",
  length: "3",
  hips: "5",
  shoulders: "6",
  chest: "7",
  sleeve: "8",
  width: "9",
  height: "10",
  "leg open": "11",
  "bottom width": "13",
  "width to last": "16",
  "width to first": "15",
};

export type MeasurementLine = {
  type: "horizontal" | "vertical";
  view?: "diagonal" | "vertical";
  name?:
    | "waist"
    | "width"
    | "chest"
    | "shoulders"
    | "hips"
    | "leg open"
    | "bottom width"
    | "width to last"
    | "width to first"
    | "length"
    | "inseam"
    | "sleeve"
    | "height";
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
  selectedSize?: number;
}

export function SvgWrapper({
  measurements = [],
  lines,
  originalViewBox,
  children,
  selectedSize,
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

  const getMeasurementValue = (measurementName: string) => {
    const measurementId = MEASUREMENT_NAME_TO_ID[measurementName];
    if (!measurementId) return "0";

    const measurement = measurements.find(
      (m) =>
        m.measurementNameId?.toString() === measurementId &&
        m.productSizeId === selectedSize,
    );
    return measurement?.measurementValue?.value || "0";
  };

  const filteredLines = lines.filter((line) => {
    if (!line.name) return true;
    const value = getMeasurementValue(line.name);
    return value !== "0";
  });

  return (
    <svg
      fill="none"
      viewBox={STANDARD_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <g transform={normalizeTransform(originalViewBox || STANDARD_VIEWBOX)}>
        {children}
        {filteredLines.map((line, index) =>
          line.type === "horizontal" ? (
            <HorizontalLine
              key={`${line.name}-${index}`}
              measurementType={line.name || ""}
              info={getMeasurementValue(line.name || "")}
              y={line.y || 0}
              xStart={line.xStart || 0}
              xEnd={line.xEnd || 0}
            />
          ) : (
            <VerticalLine
              key={`${line.name}-${index}`}
              measurementType={line.name || ""}
              info={getMeasurementValue(line.name || "")}
              x={line.x || 0}
              xEnd={line.xEnd || 0}
              yStart={line.yStart || 0}
              yEnd={line.yEnd || 0}
              view={line.view}
            />
          ),
        )}
      </g>
    </svg>
  );
}
