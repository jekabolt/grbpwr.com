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
    <foreignObject x="-100" y="-20" width="200" height="45">
      <div className="m-auto flex w-fit flex-col items-center bg-highlightColor px-2 text-bgColor">
        <Text variant="inherit">{measurementType}</Text>
        <Text variant="inherit">{info} cm</Text>
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
