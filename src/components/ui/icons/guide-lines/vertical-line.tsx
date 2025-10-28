import { FC } from "react";

import { useMeasurementStore } from "@/lib/stores/measurement/store";
import { useDataContext } from "@/components/contexts/DataContext";
import {
  getUnit,
  Unit,
} from "@/app/[locale]/product/[...productParams]/_components/measurements-table";

import { Text } from "../../text";

type Position = {
  x: number;
  yStart: number;
  yEnd: number;
  xEnd?: number;
  yOffset?: number;
  textY?: number;
  rectXOffset?: number;
  rectYOffset?: number;
};

type LabelProps = {
  info: string;
  measurementType: string;
  x: number;
  y?: number;
  xOffset?: number;
  yOffset?: number;
  unit?: Unit;
};

const MeasurementLabel: FC<LabelProps> = ({
  info,
  measurementType,
  x,
  y = 0,
  xOffset = 0,
  yOffset = 0,
  unit = Unit.CM,
}) => {
  const { handleMeasurementHover, handleMeasurementLeave } =
    useMeasurementStore();
  const { dictionary } = useDataContext();
  const measurementName = dictionary?.measurements?.find(
    (m) => m.name?.toLowerCase() === measurementType.toLowerCase(),
  )?.name;

  const displayValue = getUnit(info, unit);

  return (
    <g transform={`translate(${x + xOffset} ${y + yOffset})`}>
      <foreignObject x="-100" y="-20" width="200" height="45">
        <div
          className="m-auto flex w-fit cursor-pointer flex-col items-center bg-highlightColor px-2 text-bgColor"
          onMouseEnter={() => handleMeasurementHover(measurementName || "")}
          onMouseLeave={() => handleMeasurementLeave()}
        >
          <Text variant="inherit" size="measurement" className="uppercase">
            {measurementName}
          </Text>
          <Text variant="inherit" size="measurement" className="uppercase">
            {displayValue}
          </Text>
        </div>
      </foreignObject>
    </g>
  );
};

export const VerticalLine: FC<
  Position & LabelProps & { view?: "vertical" | "diagonal"; unit?: Unit }
> = ({
  info,
  x,
  yStart,
  yEnd,
  textY,
  rectXOffset = 0,
  rectYOffset = 0,
  view = "vertical",
  xEnd,
  yOffset = 0,
  measurementType,
  unit = Unit.CM,
}) => {
  const endX = view === "diagonal" ? xEnd ?? x + (yEnd - yStart) : x;
  const adjustedY = {
    start: yStart + yOffset,
    end: yEnd + yOffset,
  };

  const center = {
    x: view === "diagonal" ? (x + endX) / 2 : x,
    y: textY ?? (adjustedY.start + adjustedY.end) / 2,
  };

  return (
    <>
      <path
        d={`M${x} ${adjustedY.start}L${endX} ${adjustedY.end}`}
        stroke="#311EEE"
        strokeWidth="1"
        fill="none"
      />
      <MeasurementLabel
        info={info}
        measurementType={measurementType}
        x={center.x}
        y={center.y}
        xOffset={rectXOffset}
        yOffset={rectYOffset}
        unit={unit}
      />
    </>
  );
};
