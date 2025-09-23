import { FC } from "react";

import { useMeasurementStore } from "@/lib/stores/measurement/store";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import {
  getUnit,
  Unit,
} from "@/app/[locale]/product/[...productParams]/_components/measurements-table";

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
  unit?: Unit;
};

const MeasurementLabel: FC<LabelProps> = ({
  info,
  measurementType,
  x = 0,
  y,
  xOffset = 0,
  yOffset = 0,
  unit = Unit.CM,
}) => {
  const { handleMeasurementHover, handleMeasurementLeave } =
    useMeasurementStore();
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);

  const displayValue = getUnit(info, unit);

  // Get the translated measurement name
  const getTranslatedMeasurementName = (name: string): string => {
    const measurement = dictionary?.measurements?.find(
      (m) =>
        m.translations
          ?.find((t) => t.languageId === languageId)
          ?.name?.toLowerCase() === name.toLowerCase() ||
        m.translations?.[0]?.name?.toLowerCase() === name.toLowerCase(),
    );

    return (
      measurement?.translations?.find((t) => t.languageId === languageId)
        ?.name ||
      measurement?.translations?.[0]?.name ||
      name
    );
  };

  const translatedMeasurementType =
    getTranslatedMeasurementName(measurementType);

  return (
    <g transform={`translate(${x + xOffset} ${y + yOffset})`}>
      <foreignObject x="-120" y="-20" width="240" height="60">
        <div
          className="m-auto flex w-fit cursor-pointer flex-col items-center bg-highlightColor px-2 text-bgColor"
          onMouseEnter={() => handleMeasurementHover(translatedMeasurementType)}
          onMouseLeave={() => handleMeasurementLeave()}
        >
          <Text variant="inherit" size="measurement" className="uppercase">
            {translatedMeasurementType}
          </Text>
          <Text variant="inherit" size="measurement" className="uppercase">
            {displayValue}
          </Text>
        </div>
      </foreignObject>
    </g>
  );
};

export const HorizontalLine: FC<Position & LabelProps & { unit?: Unit }> = ({
  info,
  xStart,
  xEnd,
  y,
  rectYOffset = 0,
  measurementType,
  unit = Unit.CM,
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
        unit={unit}
      />
    </>
  );
};
