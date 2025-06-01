import { FC } from "react";

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
};

const MeasurementLabel: FC<LabelProps> = ({
  info,
  measurementType,
  x,
  y = 0,
  xOffset = 0,
  yOffset = 0,
}) => (
  <g transform={`translate(${x + xOffset} ${y + yOffset})`}>
    <foreignObject x="-100" y="-20" width="200" height="45">
      <div className="m-auto flex w-fit flex-col items-center bg-highlightColor px-2 text-bgColor">
        <Text variant="inherit" size="measurement" className="uppercase">
          {measurementType}
        </Text>
        <Text variant="inherit" size="measurement" className="uppercase">
          {info} cm
        </Text>
      </div>
    </foreignObject>
  </g>
);

export const VerticalLine: FC<
  Position & LabelProps & { view?: "vertical" | "diagonal" }
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
      />
    </>
  );
};
