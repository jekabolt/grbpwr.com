"use client";

import type {
  common_ProductMeasurement,
  common_ProductSize,
} from "@/api/proto-http/frontend";

import { useMeasurementStore } from "@/lib/stores/measurement/store";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { SizesTable } from "./sizes-table";
import { MeasurementType } from "./utils/useMeasurementType";

export enum Unit {
  CM = "CM",
  INCHES = "INCHES",
}

export function MeasurementsTable({
  selectedSize,
  type,
  measurements,
  unit,
  sizes,
  handleSelectSize,
}: Props) {
  const { dictionary } = useDataContext();
  const { hoveredMeasurement, setHoveredMeasurement } = useMeasurementStore();

  const measurementsWithNames = measurements.map((measurement) => {
    const name = dictionary?.measurements?.find(
      (m: any) => m.id === measurement.measurementNameId,
    )?.name;
    return {
      name,
      ...measurement,
    };
  });

  const measurementsForSelectedSize = measurementsWithNames
    .filter((m) => m.productSizeId === selectedSize)
    .map(({ name, measurementValue }) => ({
      name,
      value: getUnit(measurementValue?.value || "", unit),
    }));

  if (type === "clothing") {
    return (
      <div className="h-26 overflow-y-auto">
        {measurementsForSelectedSize.map((m, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between p-1 odd:bg-textInactiveColor hover:cursor-pointer hover:bg-highlightColor hover:text-bgColor",
              {
                "bg-highlightColor text-bgColor odd:bg-highlightColor":
                  hoveredMeasurement === m.name,
              },
            )}
            onMouseEnter={() => setHoveredMeasurement(m.name || null)}
            onMouseLeave={() => setHoveredMeasurement(null)}
          >
            <Text>{m.name}</Text>
            <Text>{m.value}</Text>
          </div>
        ))}
      </div>
    );
  }

  if (type === "shoe" || type === "ring") {
    return (
      <SizesTable
        sizes={sizes}
        type={type}
        selectedSize={selectedSize}
        handleSelectSize={handleSelectSize}
      />
    );
  }
}

export function getUnit(value: string, unit: Unit) {
  if (unit === Unit.CM) {
    return `${value} CM`;
  }

  return `${(parseInt(value) * 0.393701).toFixed(1)} IN`;
}

type Props = {
  selectedSize?: number;
  unit: Unit;
  type: MeasurementType;
  measurements: common_ProductMeasurement[];
  sizes: common_ProductSize[];
  handleSelectSize: (sizeId: number) => void;
};
