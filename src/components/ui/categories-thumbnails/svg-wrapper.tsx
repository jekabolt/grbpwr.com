import { SVGProps } from "react";
import { common_ProductMeasurement } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Unit } from "@/app/product/[...productParams]/_components/measurements-table";

import { HorizontalLine } from "../icons/guide-lines/horizontal-line";
import { VerticalLine } from "../icons/guide-lines/vertical-line";

const SVG_CONFIG = {
  size: { width: 800, height: 1000, padding: 100 },
  viewBox: "0 0 800 1000",
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
  unit?: Unit;
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

const useMeasurementValue = (
  measurements: common_ProductMeasurement[],
  selectedSize?: number,
) => {
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);

  return (measurementName: string) => {
    // First try to find by translated name (current language)
    let measurementId = dictionary?.measurements?.find(
      (m) =>
        m.translations
          ?.find((t) => t.languageId === languageId)
          ?.name?.toLowerCase() === measurementName.toLowerCase(),
    )?.id;

    // If not found, try to find by English name (fallback)
    if (!measurementId) {
      measurementId = dictionary?.measurements?.find(
        (m) =>
          m.translations?.[0]?.name?.toLowerCase() ===
          measurementName.toLowerCase(),
      )?.id;
    }

    if (!measurementId) {
      return "0";
    }

    const value =
      measurements.find(
        (m) =>
          m.measurementNameId === measurementId &&
          m.productSizeId === selectedSize,
      )?.measurementValue?.value || "0";

    return value;
  };
};

export function SvgWrapper({
  measurements = [],
  lines,
  originalViewBox = SVG_CONFIG.viewBox,
  children,
  selectedSize,
  unit = Unit.CM,
  ...props
}: MeasurementSvgProps) {
  const measurementValue = useMeasurementValue(measurements, selectedSize);
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
              unit={unit}
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
              unit={unit}
            />
          ),
        )}
      </g>
    </svg>
  );
}
