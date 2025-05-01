import { SVGProps } from "react";
import { common_ProductMeasurement } from "@/api/proto-http/frontend";

import { useDataContext } from "@/components/contexts/DataContext";

import { HorizontalLine } from "../icons/guide-lines/horizontal-line";
import { VerticalLine } from "../icons/guide-lines/vertical-line";

const SVG_CONFIG = {
  size: { width: 600, height: 800, padding: 50 },
  viewBox: "0 0 600 800",
} as const;

export type MeasurementType =
  | "waist"
  | "width"
  | "chest"
  | "shoulders"
  | "hips"
  | "leg-opening"
  | "bottom-width"
  | "end-fit-length"
  | "start-fit-length"
  | "length"
  | "inseam"
  | "sleeve"
  | "height";

export type MeasurementLine = {
  type: "horizontal" | "vertical";
  view?: "diagonal" | "vertical";
  name?: MeasurementType;
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

const normalizeSVGContainer = (originalViewBox: string) => {
  const [origX, origY, origWidth, origHeight] = originalViewBox
    .split(" ")
    .map(Number);
  const { size } = SVG_CONFIG;

  const contentWidth = size.width - 2 * size.padding;
  const contentHeight = size.height - 2 * size.padding;

  const scale = Math.min(contentWidth / origWidth, contentHeight / origHeight);
  const offsetX = (size.width - origWidth * scale) / 2;
  const offsetY = (size.height - origHeight * scale) / 2;

  return `translate(${offsetX - origX * scale}, ${offsetY - origY * scale}) scale(${scale})`;
};

const getMeasurementValue = (
  measurements: common_ProductMeasurement[],
  selectedSize?: number,
) => {
  const { dictionary } = useDataContext();

  return (measurementName: string) => {
    const measurementId = dictionary?.measurements?.find(
      (m) => m.name?.toLowerCase() === measurementName.toLowerCase(),
    )?.id;

    if (!measurementId) return "0";

    return (
      measurements.find(
        (m) =>
          m.measurementNameId === measurementId &&
          m.productSizeId === selectedSize,
      )?.measurementValue?.value || "0"
    );
  };
};

export function SvgWrapper({
  measurements = [],
  lines,
  originalViewBox = SVG_CONFIG.viewBox,
  children,
  selectedSize,
  ...props
}: MeasurementSvgProps) {
  const measurementValue = getMeasurementValue(measurements, selectedSize);
  const transform = normalizeSVGContainer(originalViewBox);

  const filteredLines = lines.filter(
    (line) => !line.name || measurementValue(line.name) !== "0",
  );

  return (
    <svg
      fill="none"
      viewBox={SVG_CONFIG.viewBox}
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <g transform={transform}>
        {children}
        {filteredLines.map((line, index) =>
          line.type === "horizontal" ? (
            <HorizontalLine
              key={`${line.name}-${index}`}
              measurementType={line.name || ""}
              info={measurementValue(line.name || "")}
              y={line.y || 0}
              xStart={line.xStart || 0}
              xEnd={line.xEnd || 0}
            />
          ) : (
            <VerticalLine
              key={`${line.name}-${index}`}
              measurementType={line.name || ""}
              info={measurementValue(line.name || "")}
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
