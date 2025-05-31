import { FC } from "react";

import { Text } from "../../text";

type Position = {
  xStart: number;
  xEnd: number;
  y: number;
  rectYOffset?: number;
};

type LabelProps = {
  info: string;
  measurementType: string;
  x?: number;
  y: number;
  xOffset?: number;
  yOffset?: number;
};

const MeasurementLabel: FC<LabelProps> = ({
  info,
  measurementType,
  x = 0,
  y,
  xOffset = 0,
  yOffset = 0,
}) => (
  <g transform={`translate(${x + xOffset} ${y + yOffset})`}>
    <foreignObject x="-120" y="-25" width="240" height="60">
      <div className="m-auto flex w-fit flex-col items-center bg-highlightColor px-2 text-bgColor">
        <Text variant="inherit" className="text-[15px]">
          {measurementType}
        </Text>
        <Text variant="inherit" className="text-[15px]">
          {info} cm
        </Text>
      </div>
    </foreignObject>
  </g>
);

export const HorizontalLine: FC<Position & LabelProps> = ({
  info,
  xStart,
  xEnd,
  y,
  rectYOffset = 0,
  measurementType,
}) => {
  const center = {
    x: (xStart + xEnd) / 2,
    y: y + rectYOffset,
  };

  return (
    <>
      <path
        d={`M${xStart} ${y}L${xEnd} ${y}`}
        stroke="#311EEE"
        strokeWidth="1"
        fill="none"
        markerStart="url(#arrowStartHorizontal)"
        markerEnd="url(#arrowEndHorizontal)"
      />
      <MeasurementLabel
        info={info}
        measurementType={measurementType}
        x={center.x}
        y={center.y}
      />
    </>
  );
};
